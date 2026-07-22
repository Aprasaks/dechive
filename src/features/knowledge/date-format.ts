const KNOWLEDGE_TIME_ZONE = 'Asia/Seoul';

const knowledgeDateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: KNOWLEDGE_TIME_ZONE,
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatKnowledgeDateTime(value: string): string {
  return knowledgeDateTimeFormatter.format(new Date(value));
}
