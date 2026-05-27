import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { getEventLabel } from '@/lib/analyticsLabels';
import { createAnalyticsInsight } from '@/lib/analyticsInsight';

let analyticsClient;

const EXCLUDE_ADMIN_PATH_FILTER = {
  notExpression: {
    filter: {
      fieldName: 'pagePath',
      stringFilter: {
        matchType: 'BEGINS_WITH',
        value: '/admin',
      },
    },
  },
};

function getPropertyName() {
  const propertyId = process.env.GA_PROPERTY_ID;

  if (!propertyId) {
    throw new Error('GA_PROPERTY_ID is not configured.');
  }

  return `properties/${propertyId}`;
}

function getAnalyticsClient() {
  if (analyticsClient) return analyticsClient;

  const clientEmail = process.env.GA_CLIENT_EMAIL;
  const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('GA4 credentials are not configured.');
  }

  analyticsClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
  });

  return analyticsClient;
}

function toNumber(value) {
  return Number.parseInt(value ?? '0', 10) || 0;
}

function metric(row, index) {
  return toNumber(row.metricValues?.[index]?.value);
}

function dimension(row, index) {
  return row.dimensionValues?.[index]?.value ?? '';
}

async function runReport({ startDate, endDate }, report) {
  const [response] = await getAnalyticsClient().runReport({
    property: getPropertyName(),
    dateRanges: [{ startDate, endDate }],
    dimensionFilter: EXCLUDE_ADMIN_PATH_FILTER,
    ...report,
  });

  return response.rows ?? [];
}

function normalizeSourceMedium(sourceMedium) {
  if (sourceMedium === '(direct) / (none)') return 'direct / none';
  return sourceMedium || 'unknown / unknown';
}

function formatDateLabel(value) {
  if (!value || value.length !== 8) return value;
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

export async function getAnalytics({ startDate = 'today', endDate = 'today', periodLabel = '오늘' } = {}) {
  const dateRange = { startDate, endDate };
  const [
    summaryRows,
    sourceRows,
    pageRows,
    eventRows,
    dailyRows,
    downloadRows,
    downloadLocationRows,
  ] = await Promise.all([
    runReport(dateRange, {
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'eventCount' },
      ],
    }),
    runReport(dateRange, {
      dimensions: [{ name: 'sessionSourceMedium' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit: 10,
    }),
    runReport(dateRange, {
      dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    }),
    runReport(dateRange, {
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 20,
    }),
    runReport(dateRange, {
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'eventCount' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    }),
    runReport(dateRange, {
      dimensions: [{ name: 'fileName' }, { name: 'linkUrl' }],
      metrics: [{ name: 'activeUsers' }, { name: 'eventCount' }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            EXCLUDE_ADMIN_PATH_FILTER,
            {
              filter: {
                fieldName: 'eventName',
                stringFilter: { matchType: 'EXACT', value: 'file_download' },
              },
            },
          ],
        },
      },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 10,
    }),
    runReport(dateRange, {
      dimensions: [{ name: 'country' }, { name: 'region' }, { name: 'city' }],
      metrics: [{ name: 'activeUsers' }, { name: 'eventCount' }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            EXCLUDE_ADMIN_PATH_FILTER,
            {
              filter: {
                fieldName: 'eventName',
                stringFilter: { matchType: 'EXACT', value: 'file_download' },
              },
            },
          ],
        },
      },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 10,
    }),
  ]);

  const summaryRow = summaryRows[0] ?? {};
  const summary = {
    activeUsers: metric(summaryRow, 0),
    sessions: metric(summaryRow, 1),
    screenPageViews: metric(summaryRow, 2),
    eventCount: metric(summaryRow, 3),
  };

  const sources = sourceRows.map((row) => ({
    sourceMedium: normalizeSourceMedium(dimension(row, 0)),
    activeUsers: metric(row, 0),
    sessions: metric(row, 1),
  }));

  const pages = pageRows.map((row) => ({
    pagePath: dimension(row, 0),
    pageTitle: dimension(row, 1),
    views: metric(row, 0),
    activeUsers: metric(row, 1),
  }));

  const events = eventRows.map((row) => {
    const eventName = dimension(row, 0);

    return {
      eventName,
      eventLabel: getEventLabel(eventName),
      eventCount: metric(row, 0),
    };
  });

  const daily = dailyRows.map((row) => ({
    date: formatDateLabel(dimension(row, 0)),
    activeUsers: metric(row, 0),
    sessions: metric(row, 1),
    screenPageViews: metric(row, 2),
    eventCount: metric(row, 3),
  }));

  const downloads = downloadRows.map((row) => ({
    fileName: dimension(row, 0) || 'unknown file',
    linkUrl: dimension(row, 1),
    activeUsers: metric(row, 0),
    clicks: metric(row, 1),
  }));

  const downloadLocations = downloadLocationRows.map((row) => ({
    country: dimension(row, 0) || 'unknown country',
    region: dimension(row, 1) || 'unknown region',
    city: dimension(row, 2) || 'unknown city',
    activeUsers: metric(row, 0),
    clicks: metric(row, 1),
  }));

  const downloadSummary = downloads.reduce(
    (total, item) => ({
      activeUsers: total.activeUsers + item.activeUsers,
      clicks: total.clicks + item.clicks,
    }),
    { activeUsers: 0, clicks: 0 },
  );

  return {
    range: { startDate, endDate, periodLabel },
    summary,
    sources,
    pages,
    events,
    daily,
    downloads,
    downloadLocations,
    downloadSummary,
    insight: createAnalyticsInsight({ summary, sources, pages, events, periodLabel }),
  };
}

export async function getTodayAnalytics() {
  return getAnalytics({ startDate: 'today', endDate: 'today', periodLabel: '오늘' });
}
