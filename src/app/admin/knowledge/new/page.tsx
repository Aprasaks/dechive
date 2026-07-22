import type { Metadata } from 'next';
import Link from 'next/link';
import { KnowledgeEditor } from '@/features/admin/KnowledgeEditor';
import styles from '@/features/admin/KnowledgeEditor.module.css';

export const metadata: Metadata = { title: '새 지식', robots: { index: false, follow: false, nocache: true } };

const emptyDocument = {
  type: 'doc' as const,
  schemaVersion: 1 as const,
  content: [{ type: 'paragraph' as const }],
};

export default async function Page() {
  return (
      <main className={styles.shell}>
        <nav className={styles.nav}><Link href="/admin/knowledge">← 지식 목록</Link><span>새 지식</span></nav>
        <h1 className={styles.title}>새 지식 작성</h1>
        <KnowledgeEditor
          mode="create"
          knowledgeOptions={[]}
          initial={{ title: '', slug: '', locale: 'ko', summary: '', tags: [], hero: null, heroImageUrl: null, document: emptyDocument }}
        />
      </main>
  );
}
