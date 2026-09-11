'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { Content } from '@tiptap/core';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react';
import type { ContentType, Json } from '@/lib/supabase/database.types';
import { getContentSection } from '@/lib/content/catalog';
import { saveDraft } from '../../actions';

type DraftSnapshot = {
  title: string;
  slug: string;
  summary: string;
  learningObjectivesText: string;
  bodyJson: Json;
};

type SaveStatus = 'saved' | 'unsaved' | 'saving' | 'error' | 'conflict';

type DraftEditorProps = {
  contentId: string;
  contentType: ContentType;
  initialVersion: number;
  initialUpdatedAt: string;
  initialDraft: DraftSnapshot;
};

const STATUS_LABELS: Record<SaveStatus, string> = {
  saved: '저장됨',
  unsaved: '저장 대기',
  saving: '저장 중…',
  error: '저장 실패',
  conflict: '다른 수정본 확인 필요',
};

function toLearningObjectives(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function DraftEditor({
  contentId,
  contentType,
  initialVersion,
  initialUpdatedAt,
  initialDraft,
}: DraftEditorProps) {
  const section = getContentSection(contentType);
  const [draft, setDraft] = useState(initialDraft);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);
  const [version, setVersion] = useState(initialVersion);
  const [saveRequest, setSaveRequest] = useState(0);
  const draftRef = useRef(draft);
  const versionRef = useRef(initialVersion);
  const changeNumberRef = useRef(0);
  const saveInFlightRef = useRef(false);
  const queuedSaveRef = useRef(false);

  const markChanged = useCallback((next: DraftSnapshot) => {
    draftRef.current = next;
    changeNumberRef.current += 1;
    setDraft(next);
    setSaveStatus('unsaved');
    setSaveMessage(null);
  }, []);

  const runSave = useCallback(async () => {
    if (saveInFlightRef.current) {
      queuedSaveRef.current = true;
      return;
    }

    saveInFlightRef.current = true;
    queuedSaveRef.current = false;
    const savingChangeNumber = changeNumberRef.current;
    const snapshot = draftRef.current;
    setSaveStatus('saving');
    setSaveMessage(null);

    const result = await saveDraft({
      contentId,
      expectedVersion: versionRef.current,
      slug: snapshot.slug,
      title: snapshot.title,
      summary: snapshot.summary,
      bodyJson: snapshot.bodyJson,
      learningObjectives: toLearningObjectives(
        snapshot.learningObjectivesText,
      ),
    });

    if (result.ok) {
      versionRef.current = result.version;
      setVersion(result.version);
      setUpdatedAt(result.updatedAt);

      if (
        changeNumberRef.current === savingChangeNumber &&
        !queuedSaveRef.current
      ) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('unsaved');
      }
    } else {
      setSaveStatus(result.conflict ? 'conflict' : 'error');
      setSaveMessage(result.error);
    }

    saveInFlightRef.current = false;

    if (queuedSaveRef.current && result.ok) {
      setSaveRequest((current) => current + 1);
    }
  }, [contentId]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
    ],
    content: initialDraft.bodyJson as Content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap-writing-surface',
        'aria-label': '본문',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      markChanged({
        ...draftRef.current,
        bodyJson: JSON.parse(JSON.stringify(currentEditor.getJSON())) as Json,
      });
    },
  });

  useEffect(() => {
    if (saveStatus !== 'unsaved') {
      return;
    }

    const timeout = window.setTimeout(() => {
      void runSave();
    }, 1100);

    return () => window.clearTimeout(timeout);
  }, [draft, runSave, saveRequest, saveStatus]);

  useEffect(() => {
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      if (saveStatus === 'unsaved' || saveStatus === 'saving') {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', warnBeforeLeaving);
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
  }, [saveStatus]);

  const updateField = <Key extends keyof DraftSnapshot>(
    key: Key,
    value: DraftSnapshot[Key],
  ) => {
    markChanged({ ...draftRef.current, [key]: value });
  };

  const keepEditorFocus = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <main id="main-content" className="admin-editor-page">
      <header className="editor-topbar">
        <div>
          <Link href="/admin" className="admin-brand">
            DECHIVE
          </Link>
          <span>{section.label}</span>
        </div>
        <div className={`save-indicator is-${saveStatus}`}>
          <span aria-hidden="true" />
          {STATUS_LABELS[saveStatus]}
        </div>
        <div className="editor-topbar-actions">
          <button
            disabled={saveStatus === 'saving' || saveStatus === 'conflict'}
            onClick={() => void runSave()}
            type="button"
          >
            지금 저장
          </button>
          <button disabled type="button" title="발행 기능은 다음 단계에서 연결합니다.">
            발행 준비
          </button>
        </div>
      </header>

      <div className="editor-layout">
        <section className="editor-document">
          <label className="editor-title-field">
            <span>제목</span>
            <textarea
              aria-label="제목"
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="제목을 입력하세요"
              rows={2}
              value={draft.title}
            />
          </label>

          <div className="editor-meta-fields">
            <label>
              <span>주소</span>
              <div>
                <small>dechive.dev/{section.href.slice(1)}/</small>
                <input
                  aria-describedby="slug-help"
                  onChange={(event) => updateField('slug', event.target.value)}
                  spellCheck={false}
                  value={draft.slug}
                />
              </div>
              <em id="slug-help">영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.</em>
            </label>
            <label>
              <span>한 줄 설명</span>
              <textarea
                onChange={(event) => updateField('summary', event.target.value)}
                placeholder="목록과 검색 결과에 보일 핵심 설명"
                rows={3}
                value={draft.summary}
              />
            </label>
          </div>

          {contentType === 'knowledge' ? (
            <label className="learning-objectives-field">
              <span>이 글에서 알아야 할 것</span>
              <textarea
                onChange={(event) =>
                  updateField('learningObjectivesText', event.target.value)
                }
                placeholder={'한 줄에 하나씩 적어주세요\n예: 생성형 AI와 일반 AI의 차이'}
                rows={4}
                value={draft.learningObjectivesText}
              />
              <em>독자가 글을 읽고 분명히 알게 될 내용을 적습니다.</em>
            </label>
          ) : null}

          <section className="body-editor" aria-label="본문 에디터">
            <div className="editor-toolbar" role="toolbar" aria-label="본문 서식">
              <button
                aria-pressed={editor?.isActive('paragraph') ?? false}
                disabled={!editor}
                onClick={() => editor?.chain().focus().setParagraph().run()}
                onMouseDown={keepEditorFocus}
                type="button"
              >
                본문
              </button>
              <button
                aria-pressed={editor?.isActive('heading', { level: 2 }) ?? false}
                disabled={!editor}
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                onMouseDown={keepEditorFocus}
                type="button"
              >
                H2
              </button>
              <button
                aria-pressed={editor?.isActive('heading', { level: 3 }) ?? false}
                disabled={!editor}
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                onMouseDown={keepEditorFocus}
                type="button"
              >
                H3
              </button>
              <button
                aria-pressed={editor?.isActive('bold') ?? false}
                disabled={!editor}
                onClick={() => editor?.chain().focus().toggleBold().run()}
                onMouseDown={keepEditorFocus}
                type="button"
              >
                굵게
              </button>
              <button
                aria-pressed={editor?.isActive('italic') ?? false}
                disabled={!editor}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                onMouseDown={keepEditorFocus}
                type="button"
              >
                기울임
              </button>
              <button
                aria-pressed={editor?.isActive('bulletList') ?? false}
                disabled={!editor}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                onMouseDown={keepEditorFocus}
                type="button"
              >
                목록
              </button>
              <button
                aria-pressed={editor?.isActive('blockquote') ?? false}
                disabled={!editor}
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                onMouseDown={keepEditorFocus}
                type="button"
              >
                인용
              </button>
              <span />
              <button
                disabled={!editor?.can().undo()}
                onClick={() => editor?.chain().focus().undo().run()}
                onMouseDown={keepEditorFocus}
                type="button"
              >
                실행 취소
              </button>
              <button
                disabled={!editor?.can().redo()}
                onClick={() => editor?.chain().focus().redo().run()}
                onMouseDown={keepEditorFocus}
                type="button"
              >
                다시 실행
              </button>
            </div>
            <EditorContent editor={editor} />
          </section>
        </section>

        <aside className="editor-side-panel">
          <p className="eyebrow">DRAFT</p>
          <dl>
            <div>
              <dt>유형</dt>
              <dd>{section.label}</dd>
            </div>
            <div>
              <dt>초안 버전</dt>
              <dd>{version}</dd>
            </div>
            <div>
              <dt>마지막 저장</dt>
              <dd>
                {new Intl.DateTimeFormat('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(updatedAt))}
              </dd>
            </div>
          </dl>
          <p>
            입력을 멈추면 자동으로 저장됩니다. 발행 전까지 공개 사이트에는
            보이지 않습니다.
          </p>
          {saveMessage ? <p role="alert">{saveMessage}</p> : null}
        </aside>
      </div>
    </main>
  );
}
