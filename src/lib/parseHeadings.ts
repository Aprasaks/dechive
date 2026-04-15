import GithubSlugger from 'github-slugger';

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function parseHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const regex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    const id = slugger.slug(text);
    headings.push({ id, text, level });
  }

  return headings;
}
