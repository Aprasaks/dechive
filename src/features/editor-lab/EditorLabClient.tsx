'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import type { JSONContent } from '@tiptap/core';
import type { FixtureDocument } from './document';
import { checksumSnapshot, findUnknownNodes, fromTipTapJSON, plainText, toNormalizedMarkdown, toTipTapJSON, validateDocument } from './document';
import { editorExtensions } from './editor-extensions';
import { sanitizeImportedHtml, validateDechiveDocument } from './security';
import styles from './EditorLab.module.css';

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'failed' | 'composing';
type Snapshot = { document: JSONContent; markdown: string; html: string; text: string; checksum: string };
const STORAGE_KEY = 'dechive:editor-lab:v1';

export function EditorLabClient({ fixtures }: { fixtures: FixtureDocument[] }) {
  const [fixtureId, setFixtureId] = useState(fixtures[0].id);
  const fixture = useMemo(() => fixtures.find((item) => item.id === fixtureId) ?? fixtures[0], [fixtureId, fixtures]);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [runtimeMs, setRuntimeMs] = useState<Record<string, number>>({});
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const composing = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: editorExtensions,
    content: toTipTapJSON(fixture.document),
    immediatelyRender: false,
    editorProps: {
      attributes: { 'aria-label': 'Dechive 문서 편집 영역', lang: fixtureId.endsWith('-en') ? 'en' : 'ko' },
      transformPastedHTML: (html) => sanitizeImportedHtml(html).html,
      handleDOMEvents: {
        compositionstart: () => { composing.current = true; setSaveState('composing'); return false; },
        compositionend: () => { composing.current = false; setSaveState('dirty'); return false; },
      },
    },
    onCreate: ({ editor: current }) => setRuntimeMs((value) => ({ ...value, editorCreation: performance.now(), initialCharacters: current.getText().length })),
    onUpdate: () => { if (!composing.current) setSaveState('dirty'); },
  }, [fixtureId]);

  const save = useCallback(() => {
    if (!editor || composing.current) return;
    setSaveState('saving');
    window.setTimeout(() => {
      if (simulateFailure) { setSaveState('failed'); return; }
      const value = editor.getJSON();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fixtureId, value }));
      setLastSavedAt(new Date().toLocaleTimeString('ko-KR'));
      setSaveState('saved');
    }, 120);
  }, [editor, fixtureId, simulateFailure]);

  useEffect(() => {
    if (saveState !== 'dirty' || composing.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(save, 700);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [save, saveState]);

  const selectFixture = (id: string) => {
    setFixtureId(id); setSnapshot(null); setSaveState('idle');
  };

  const restore = () => {
    if (!editor) return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as { fixtureId: string; value: JSONContent };
    if (saved.fixtureId !== fixtureId) return;
    editor.commands.setContent(saved.value);
    setSaveState('saved');
  };

  const createSnapshot = async () => {
    if (!editor) return;
    const started = performance.now();
    const document = fromTipTapJSON(editor.getJSON());
    const unknown = findUnknownNodes(document);
    if (unknown.length) { setSaveState('failed'); setSnapshot(null); return; }
    validateDocument(document);
    const publication = validateDechiveDocument(document, 'publish');
    if (publication.status === 'rejected' || publication.status === 'needs_review') { setSaveState('failed'); setSnapshot(null); setValidationMessage(publication.issues.map((issue) => `${issue.code}@${issue.path}`).slice(0, 5).join(', ')); return; }
    setValidationMessage(null);
    const serializationStarted = performance.now();
    const markdown = toNormalizedMarkdown(document);
    const html = editor.getHTML();
    const text = plainText(document);
    const checksum = await checksumSnapshot({ document, markdown, html, text });
    setRuntimeMs((value) => ({ ...value, snapshotTotal: performance.now() - started, serialization: performance.now() - serializationStarted }));
    setSnapshot({ document, markdown, html, text, checksum });
  };

  const addUnknown = () => editor?.chain().focus().insertContent({ type: 'unknownBlock', attrs: { originalType: 'legacyInteractiveDiagram', payload: { version: 7, points: [1, 2, 3] }, fallbackText: '레거시 구조도 원문이 보존됨' } }).run();
  const unknownCount = editor ? findUnknownNodes(editor.getJSON()).length : 0;

  return <main className={styles.shell}>
    <header className={styles.header}><p className={styles.eyebrow}>Development only · localStorage is not production storage</p><h1>Editor Runtime Lab</h1><p className={styles.notice}>실제 Dechive fixture를 읽기 전용으로 불러옵니다. 이 화면은 CMS가 아니며 production에서는 404입니다. Autosave는 조합 종료 후 localStorage에만 저장하고 Markdown은 Publish Snapshot에서만 생성합니다.</p></header>
    <div className={styles.grid}>
      <aside className={styles.sidebar} aria-label="Fixture와 측정 정보">
        <section className={styles.panel}><h2>Fixture</h2><div className={styles.fixtureList}>{fixtures.map((item) => <button key={item.id} className={styles.fixtureButton} aria-pressed={item.id === fixtureId} onClick={() => selectFixture(item.id)}>{item.label}</button>)}</div></section>
        <section className={styles.panel}><h2>원본 측정</h2><dl className={styles.metrics}>{Object.entries(fixture.sourceMetrics).map(([key, value]) => <span key={key} style={{display:'contents'}}><dt>{key}</dt><dd>{value.toLocaleString()}</dd></span>)}</dl>{fixture.warnings.map((warning) => <p key={warning} className={styles.danger}>{warning}</p>)}</section>
      </aside>
      <section className={styles.workspace} aria-label="TipTap prototype workspace">
        <div className={styles.toolbar} role="toolbar" aria-label="문서 편집 도구">
          <button onClick={() => editor?.chain().focus().toggleBold().run()} aria-pressed={editor?.isActive('bold')}>굵게</button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} aria-pressed={editor?.isActive('heading', {level:2})}>제목 2</button>
          <button onClick={() => editor?.chain().focus().toggleBulletList().run()} aria-pressed={editor?.isActive('bulletList')}>목록</button>
          <button onClick={() => editor?.chain().focus().toggleCodeBlock().run()} aria-pressed={editor?.isActive('codeBlock')}>코드</button>
          <button onClick={() => editor?.chain().focus().undo().run()}>실행 취소</button><button onClick={() => editor?.chain().focus().redo().run()}>다시 실행</button>
          <button onClick={addUnknown}>Unknown 삽입</button>
        </div>
        <div className={styles.editorFrame}><EditorContent editor={editor} /></div>
        <div className={styles.status} aria-live="polite"><span>저장: <strong className={saveState === 'failed' ? styles.danger : ''}>{saveState}</strong></span><span>마지막 저장: <strong>{lastSavedAt ?? '없음'}</strong></span><span>Unknown: <strong className={unknownCount ? styles.danger : ''}>{unknownCount}</strong></span></div>
        <div className={styles.actions}>
          <button className={`${styles.action} ${styles.actionPrimary}`} onClick={createSnapshot} disabled={!editor}>Publish Snapshot</button>
          <button className={styles.action} onClick={restore}>localStorage 복원</button>
          <label className={styles.action}><input type="checkbox" checked={simulateFailure} onChange={(event) => setSimulateFailure(event.target.checked)} /> 저장 실패 simulation</label>
        </div>
        {unknownCount > 0 && <p role="alert" className={styles.danger}>지원하지 않는 node가 원본 payload와 함께 보존되어 있습니다. 해결 전 Publish Snapshot이 차단됩니다.</p>}
        {validationMessage && <p role="alert" className={styles.danger}>Publish validation: {validationMessage}</p>}
        {snapshot && <section className={styles.panel}><h2>Publish Snapshot</h2><dl className={styles.metrics}><dt>checksum</dt><dd>{snapshot.checksum.slice(0, 16)}…</dd><dt>Markdown</dt><dd>{snapshot.markdown.length.toLocaleString()} chars</dd><dt>HTML</dt><dd>{snapshot.html.length.toLocaleString()} chars</dd><dt>Plain text</dt><dd>{snapshot.text.length.toLocaleString()} chars</dd><dt>serialize</dt><dd>{runtimeMs.serialization?.toFixed(2)} ms</dd></dl><details><summary>JSON 확인</summary><pre className={styles.output}>{JSON.stringify(snapshot.document, null, 2)}</pre></details></section>}
      </section>
    </div>
  </main>;
}
