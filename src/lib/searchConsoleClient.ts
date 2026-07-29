import { createSign } from 'node:crypto';

type SearchConsoleApiRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

type SearchConsoleApiResponse = {
  rows?: SearchConsoleApiRow[];
};

type AnalyticsDateRange = {
  preset: string;
  startDate: string;
  endDate: string;
  periodLabel: string;
};

export type SearchConsoleStatus = 'connected' | 'not_configured' | 'permission_denied' | 'unavailable' | 'data_delayed';

export type SearchConsoleMetric = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type SearchConsoleRow = SearchConsoleMetric & { key: string };

export type SearchConsoleReport = {
  status: SearchConsoleStatus;
  siteUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  requestedPeriodLabel: string;
  dataNote: string;
  summary: SearchConsoleMetric;
  queries: SearchConsoleRow[];
  pages: SearchConsoleRow[];
  opportunities: SearchConsoleRow[];
};

const SEARCH_CONSOLE_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const API_ENDPOINT = 'https://www.googleapis.com/webmasters/v3/sites';
const REQUEST_TIMEOUT_MS = 10_000;

function configuredCredentials() {
  const clientEmail = process.env.SEARCH_CONSOLE_CLIENT_EMAIL || process.env.GA_CLIENT_EMAIL;
  const privateKey = process.env.SEARCH_CONSOLE_PRIVATE_KEY || process.env.GA_PRIVATE_KEY;
  const siteUrl = process.env.SEARCH_CONSOLE_SITE_URL?.trim();

  if (!clientEmail || !privateKey || !siteUrl) return null;
  return { clientEmail, privateKey: privateKey.replace(/\\n/g, '\n'), siteUrl: normalizeSiteUrl(siteUrl) };
}

export function isSearchConsoleConfigured() {
  return Boolean(configuredCredentials());
}

export function normalizeSiteUrl(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith('sc-domain:')) return trimmed;

  const url = new URL(trimmed);
  const pathname = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  return `${url.origin}${pathname}`;
}

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function createServiceAccountAssertion(clientEmail: string, privateKey: string) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64Url(JSON.stringify({
    iss: clientEmail,
    scope: SEARCH_CONSOLE_SCOPE,
    aud: TOKEN_ENDPOINT,
    iat: now,
    exp: now + 3600,
  }));
  const unsignedToken = `${header}.${payload}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  return `${unsignedToken}.${base64Url(signer.sign(privateKey))}`;
}

async function getAccessToken(clientEmail: string, privateKey: string) {
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: createServiceAccountAssertion(clientEmail, privateKey),
  });
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) throw new Error(`Search Console token request failed with ${response.status}.`);
  const data = await response.json() as { access_token?: string };
  if (!data.access_token) throw new Error('Search Console token response did not include an access token.');
  return data.access_token;
}

async function querySearchAnalytics(accessToken: string, siteUrl: string, startDate: string, endDate: string, dimensions: string[]) {
  const endpoint = `${API_ENDPOINT}/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, dimensions, rowLimit: dimensions.length ? 25 : 1, dataState: 'final' }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const error = new Error(`Search Console query failed with ${response.status}.`) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  return await response.json() as SearchConsoleApiResponse;
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function getSearchConsoleDateRange(range: AnalyticsDateRange, now = new Date()) {
  const yesterday = isoDate(addDays(now, -1));
  let startDate = range.startDate;
  let endDate = range.endDate;

  if (range.preset === 'today') {
    startDate = isoDate(now);
    endDate = isoDate(now);
  } else if (range.preset === 'yesterday') {
    startDate = yesterday;
    endDate = yesterday;
  } else if (range.preset === '7days') {
    startDate = isoDate(addDays(now, -7));
    endDate = isoDate(now);
  } else if (range.preset === '30days') {
    startDate = isoDate(addDays(now, -30));
    endDate = isoDate(now);
  }

  const requestedEndDate = endDate;
  if (endDate > yesterday) endDate = yesterday;

  return {
    startDate,
    endDate,
    requestedEndDate,
    usable: startDate <= endDate,
    dataNote: requestedEndDate > yesterday ? 'Search Console 데이터는 처리 지연으로 어제까지 표시됩니다.' : 'Search Console 확정 데이터 기준입니다.',
  };
}

function metric(row: SearchConsoleApiRow | undefined): SearchConsoleMetric {
  return {
    clicks: row?.clicks ?? 0,
    impressions: row?.impressions ?? 0,
    ctr: row?.ctr ?? 0,
    position: row?.position ?? 0,
  };
}

function rows(response: SearchConsoleApiResponse, keyIndex = 0) {
  return (response.rows ?? []).map((row) => ({ key: row.keys?.[keyIndex] ?? '(unknown)', ...metric(row) }));
}

function emptyMetric(): SearchConsoleMetric {
  return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
}

function reportBase(range: AnalyticsDateRange, status: SearchConsoleStatus, siteUrl: string | null, dates: ReturnType<typeof getSearchConsoleDateRange>) {
  return {
    status,
    siteUrl,
    startDate: dates.usable ? dates.startDate : null,
    endDate: dates.usable ? dates.endDate : null,
    requestedPeriodLabel: range.periodLabel,
    dataNote: dates.dataNote,
    summary: emptyMetric(),
    queries: [],
    pages: [],
    opportunities: [],
  } satisfies SearchConsoleReport;
}

export async function getSearchConsoleReport(range: AnalyticsDateRange): Promise<SearchConsoleReport> {
  const credentials = configuredCredentials();
  const dates = getSearchConsoleDateRange(range);
  if (!credentials) return reportBase(range, 'not_configured', null, dates);
  if (!dates.usable) return reportBase(range, 'data_delayed', credentials.siteUrl, dates);

  try {
    const accessToken = await getAccessToken(credentials.clientEmail, credentials.privateKey);
    const [summaryResponse, queryResponse, pageResponse] = await Promise.all([
      querySearchAnalytics(accessToken, credentials.siteUrl, dates.startDate, dates.endDate, []),
      querySearchAnalytics(accessToken, credentials.siteUrl, dates.startDate, dates.endDate, ['query']),
      querySearchAnalytics(accessToken, credentials.siteUrl, dates.startDate, dates.endDate, ['page']),
    ]);
    const summary = metric(summaryResponse.rows?.[0]);
    const queries = rows(queryResponse);
    const pages = rows(pageResponse);
    const opportunities = queries.filter((row) => row.impressions >= 5 && row.ctr < 0.03).slice(0, 10);
    return { ...reportBase(range, 'connected', credentials.siteUrl, dates), summary, queries, pages, opportunities };
  } catch (error) {
    const status = (error as { status?: number }).status;
    return reportBase(range, status === 401 || status === 403 ? 'permission_denied' : 'unavailable', credentials.siteUrl, dates);
  }
}
