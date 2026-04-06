export interface Chunk {
  id: string;
  slug: string;
  lang: string;
  title: string;
  category: string;
  tags: string[];
  section: string;
  content: string;
  embedding: number[];
}
