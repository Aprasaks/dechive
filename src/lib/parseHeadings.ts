import GithubSlugger from 'github-slugger';

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function parseHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  const lines = content.split('\n');
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (match) {
      const level = match[1].length as 2 | 3;
      const text = match[2].trim();
      const id = slugger.slug(text);
      headings.push({ id, text, level });
    }
  }

  return headings;
}
