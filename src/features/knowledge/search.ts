export function normalizeKnowledgeSearchQuery(value: string | null | undefined): string {
  return (value ?? '').trim().replace(/\s+/g, ' ');
}

export function mergeKnowledgeItems<T extends { id: string }>(current: T[], next: T[], replace: boolean): T[] {
  if (replace) return next;
  const seen = new Set(current.map((item) => item.id));
  return [...current, ...next.filter((item) => !seen.has(item.id))];
}
