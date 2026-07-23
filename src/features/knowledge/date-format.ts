export const KNOWLEDGE_TIME_ZONE = 'Asia/Seoul';

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

const knowledgeDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: KNOWLEDGE_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function formatKnowledgeDate(value: string): string {
  const parts = Object.fromEntries(
    knowledgeDateFormatter.formatToParts(new Date(value)).map((part) => [part.type, part.value]),
  );
  return `${parts.year}.${parts.month}.${parts.day}`;
}
