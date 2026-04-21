import type { Metadata } from 'next';
import { getAllLogs } from '@/lib/logs';
import LogsClient from '@/components/logs/LogsClient';

export const metadata: Metadata = {
  title: 'Logs',
  description: 'AI와 함께하는 트러블슈팅과 데일리 로그. 날것의 성장 기록.',
  alternates: { canonical: 'https://dechive.dev/logs', languages: { 'x-default': 'https://dechive.dev/logs' } },
  openGraph: {
    title: 'Logs | Dechive',
    description: 'AI와 함께하는 트러블슈팅과 데일리 로그. 날것의 성장 기록.',
    url: 'https://dechive.dev/logs',
    images: [{ url: 'https://dechive.dev/images/thumb.webp', width: 1200, height: 630, alt: 'Dechive Logs' }],
  },
};

export default function LogsPage() {
  const logs = getAllLogs();
  return <LogsClient logs={logs} />;
}
