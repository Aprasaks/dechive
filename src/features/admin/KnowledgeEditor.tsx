'use client';
import { useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import type { JSONContent } from '@tiptap/core';
import { editorExtensions } from '@/features/editor-lab/editor-extensions';
import {
  fromTipTapJSON,
  toTipTapJSON,
  type DechiveDocument,
} from '@/features/editor-lab/document';
import { saveKnowledgeDraftAction } from '@/app/admin/knowledge/actions';
import { saveLectureDraftAction } from '@/app/admin/lectures/actions';
import type {
  KnowledgeOption,
  KnowledgeReference,
} from '@/services/knowledge-drafts';
import styles from './KnowledgeEditor.module.css';

type Common = {
  title: string;
  slug: string;
  locale: 'ko' | 'en';
  summary: string;
  document: DechiveDocument;
};
type KnowledgeFields = Common & {
  tags: string[];
  references: KnowledgeReference[];
};
type LectureFields = Common & {
  primarySourceKnowledgeId: string;
  learningObjectives: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  recommendedOrder: number | null;
  checkpoints: string[];
  audience: string;
  estimatedDurationMinutes: number | null;
  coreMessage: string;
  references: KnowledgeReference[];
};
type BaseProps = {
  mode: 'create' | 'edit';
  localizationId?: string;
  knowledgeOptions: KnowledgeOption[];
  slugLocked?: boolean;
};
type Props =
  | (BaseProps & { kind: 'knowledge'; initial: KnowledgeFields })
  | (BaseProps & { kind: 'lecture'; initial: LectureFields });
type SaveState =
  | 'unchanged'
  | 'dirty'
  | 'saving'
  | 'saved'
  | 'failed'
  | 'composing';
const lines = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

export function KnowledgeEditor(
  props: Omit<Extract<Props, { kind: 'knowledge' }>, 'kind'>,
) {
  return <ContentEditor {...props} kind="knowledge" />;
}
export function LectureEditor(
  props: Omit<Extract<Props, { kind: 'lecture' }>, 'kind'>,
) {
  return <ContentEditor {...props} kind="lecture" />;
}
function ContentEditor(props: Props) {
  const {
    mode,
    localizationId,
    knowledgeOptions,
    kind,
    slugLocked = false,
  } = props;
  const [fields, setFields] = useState(props.initial);
  const [state, setState] = useState<SaveState>('unchanged');
  const [message, setMessage] = useState('변경 없음');
  const composing = useRef(false);
  const editor = useEditor({
    extensions: editorExtensions,
    content: toTipTapJSON(props.initial.document),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        'aria-label': `${kind === 'knowledge' ? '지식' : '강의'} 본문 편집기`,
        lang: fields.locale,
      },
      handleDOMEvents: {
        compositionstart: () => {
          composing.current = true;
          setState('composing');
          return false;
        },
        compositionend: () => {
          composing.current = false;
          setState('dirty');
          return false;
        },
      },
    },
    onUpdate: () => {
      if (!composing.current) {
        setState('dirty');
        setMessage('미저장 변경 있음');
      }
    },
  });
  const dirty = (patch: Record<string, unknown>) => {
    setFields((current) => ({ ...current, ...patch }) as typeof current);
    setState('dirty');
    setMessage('미저장 변경 있음');
  };
  const save = async () => {
    if (!editor || composing.current) return;
    setState('saving');
    setMessage('저장 중');
    const document = fromTipTapJSON(
      JSON.parse(JSON.stringify(editor.getJSON())) as JSONContent,
    );
    const request = { mode, localizationId, ...fields, document };
    const result =
      kind === 'knowledge'
        ? await saveKnowledgeDraftAction(
            request as Parameters<typeof saveKnowledgeDraftAction>[0],
          )
        : await saveLectureDraftAction(
            request as Parameters<typeof saveLectureDraftAction>[0],
          );
    if (!result.ok) {
      setState('failed');
      setMessage(`저장 실패: ${result.error}`);
      return;
    }
    setState('saved');
    setMessage(`저장 완료 · version ${result.versionNumber}`);
    if (mode === 'create')
      window.location.assign(
        `/admin/${kind === 'knowledge' ? 'knowledge' : 'lectures'}/${result.localizationId}/edit`,
      );
  };
  const updateReference = (
    index: number,
    patch: Partial<KnowledgeReference>,
  ) => {
    const references = (fields as KnowledgeFields).references.map(
      (reference, at) =>
        at === index ? { ...reference, ...patch } : reference,
    );
    dirty({ references });
  };
  const addReference = () =>
    dirty({
      references: [
        ...(fields as KnowledgeFields).references,
        {
          type: 'external',
          title: '',
          authorOrOrganization: '',
          url: '',
          accessedAt: '',
          note: '',
        },
      ],
    });
  const removeReference = (index: number) =>
    dirty({
      references: (fields as KnowledgeFields).references.filter(
        (_, at) => at !== index,
      ),
    });
  const tools = [
    ['굵게', () => editor?.chain().focus().toggleBold().run()],
    ['기울임', () => editor?.chain().focus().toggleItalic().run()],
    ['H2', () => editor?.chain().focus().toggleHeading({ level: 2 }).run()],
    ['H3', () => editor?.chain().focus().toggleHeading({ level: 3 }).run()],
    ['글머리', () => editor?.chain().focus().toggleBulletList().run()],
    ['번호', () => editor?.chain().focus().toggleOrderedList().run()],
    ['인용', () => editor?.chain().focus().toggleBlockquote().run()],
    ['코드', () => editor?.chain().focus().toggleCodeBlock().run()],
  ] as const;
  const knowledgeFields = fields as KnowledgeFields;
  const lectureFields = fields as LectureFields;
  return (
    <div>
      <div className={styles.metadata}>
        <label className={styles.field}>
          제목
          <input
            value={fields.title}
            onChange={(e) => dirty({ title: e.target.value })}
            required
          />
        </label>
        <label className={styles.field}>
          Slug
          <input
            value={fields.slug}
            onChange={(e) => dirty({ slug: e.target.value })}
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            required
            disabled={kind === 'knowledge' && slugLocked}
          />
          {kind === 'knowledge' && slugLocked ? (
            <small>첫 발행 후 slug는 변경할 수 없습니다.</small>
          ) : null}
        </label>
        <label className={`${styles.field} ${styles.fieldWide}`}>
          요약
          <textarea
            rows={3}
            value={fields.summary}
            onChange={(e) => dirty({ summary: e.target.value })}
            required
          />
        </label>
        {kind === 'knowledge' ? (
          <>
            <label className={`${styles.field} ${styles.fieldWide}`}>
              태그
              <input
                value={knowledgeFields.tags.join(', ')}
                onChange={(e) => dirty({ tags: e.target.value.split(',') })}
                placeholder="쉼표로 구분, 최대 12개"
              />
            </label>
            <fieldset className={`${styles.field} ${styles.fieldWide}`}>
              <legend>참고문헌</legend>
              {knowledgeFields.references.map((reference, index) => (
                <div className={styles.reference} key={index}>
                  <label>
                    유형
                    <select
                      value={reference.type}
                      onChange={(e) =>
                        updateReference(index, {
                          type: e.target.value as KnowledgeReference['type'],
                        })
                      }
                    >
                      <option value="external">외부 자료</option>
                      <option value="direct_verification">직접 검증</option>
                    </select>
                  </label>
                  <label>
                    제목
                    <input
                      value={reference.title}
                      onChange={(e) =>
                        updateReference(index, { title: e.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    저자 또는 기관
                    <input
                      value={reference.authorOrOrganization}
                      onChange={(e) =>
                        updateReference(index, {
                          authorOrOrganization: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    URL
                    <input
                      type="url"
                      value={reference.url}
                      onChange={(e) =>
                        updateReference(index, { url: e.target.value })
                      }
                      required={reference.type === 'external'}
                    />
                  </label>
                  <label>
                    접근일
                    <input
                      type="date"
                      value={reference.accessedAt}
                      onChange={(e) =>
                        updateReference(index, { accessedAt: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    메모
                    <textarea
                      rows={2}
                      value={reference.note}
                      onChange={(e) =>
                        updateReference(index, { note: e.target.value })
                      }
                      required={reference.type === 'direct_verification'}
                    />
                  </label>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() => removeReference(index)}
                  >
                    참고문헌 삭제
                  </button>
                </div>
              ))}
              <button
                type="button"
                className={styles.button}
                onClick={addReference}
              >
                참고문헌 추가
              </button>
            </fieldset>
          </>
        ) : (
          <>
            <label className={styles.field}>
              언어
              <select
                value={lectureFields.locale}
                onChange={(e) => dirty({ locale: e.target.value })}
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
              </select>
            </label>
            <label className={styles.field}>
              권장 순서
              <input
                type="number"
                min="0"
                value={lectureFields.recommendedOrder ?? ''}
                onChange={(e) =>
                  dirty({
                    recommendedOrder:
                      e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              />
            </label>
            <label className={`${styles.field} ${styles.fieldWide}`}>
              기반 지식
              <select
                value={lectureFields.primarySourceKnowledgeId}
                onChange={(e) =>
                  dirty({ primarySourceKnowledgeId: e.target.value })
                }
                required
              >
                <option value="">지식을 선택하세요</option>
                {knowledgeOptions.map((option) => (
                  <option
                    key={option.localizationId}
                    value={option.localizationId}
                  >
                    {option.title}
                  </option>
                ))}
              </select>
              {lectureFields.primarySourceKnowledgeId ? (
                <small>
                  {
                    knowledgeOptions.find(
                      (option) =>
                        option.localizationId ===
                        lectureFields.primarySourceKnowledgeId,
                    )?.summary
                  }
                </small>
              ) : null}
            </label>
            <label className={styles.field}>
              난이도
              <select
                value={lectureFields.difficulty}
                onChange={(e) => dirty({ difficulty: e.target.value })}
              >
                <option value="beginner">초급</option>
                <option value="intermediate">중급</option>
                <option value="advanced">고급</option>
              </select>
            </label>
            <label className={styles.field}>강의 대상<small>이 강의를 누구에게 설명할지 적습니다.</small><input value={lectureFields.audience} onChange={(e)=>dirty({audience:e.target.value})}/></label>
            <label className={styles.field}>예상 시간 (분)<small>실제 강의 또는 설명에 필요한 시간입니다.</small><input type="number" min="1" value={lectureFields.estimatedDurationMinutes??''} onChange={(e)=>dirty({estimatedDurationMinutes:e.target.value===''?null:Number(e.target.value)})}/></label>
            <label className={`${styles.field} ${styles.fieldWide}`}>핵심 메시지<small>강의가 끝난 뒤 기억해야 할 한 문장입니다.</small><textarea rows={2} value={lectureFields.coreMessage} onChange={(e)=>dirty({coreMessage:e.target.value})}/></label>
            <fieldset className={`${styles.field} ${styles.fieldWide}`}><legend>참고자료</legend>{lectureFields.references.map((reference,index)=><div className={styles.reference} key={index}><label>유형<select value={reference.type} onChange={e=>updateReference(index,{type:e.target.value as KnowledgeReference['type']})}><option value="external">외부 자료</option><option value="direct_verification">직접 검증</option></select></label><label>제목<input value={reference.title} onChange={e=>updateReference(index,{title:e.target.value})}/></label><label>URL<input value={reference.url} onChange={e=>updateReference(index,{url:e.target.value})}/></label><label>메모<textarea value={reference.note} onChange={e=>updateReference(index,{note:e.target.value})}/></label><button type="button" className={styles.button} onClick={()=>removeReference(index)}>참고자료 삭제</button></div>)}<button type="button" className={styles.button} onClick={addReference}>참고자료 추가</button></fieldset>
            <label className={`${styles.field} ${styles.fieldWide}`}>
              학습 목표 (한 줄에 하나)
              <textarea
                rows={4}
                value={lectureFields.learningObjectives.join('\n')}
                onChange={(e) =>
                  dirty({ learningObjectives: lines(e.target.value) })
                }
                required
              />
            </label>
            <label className={`${styles.field} ${styles.fieldWide}`}>
              실습 또는 확인 항목 (한 줄에 하나)
              <textarea
                rows={4}
                value={lectureFields.checkpoints.join('\n')}
                onChange={(e) => dirty({ checkpoints: lines(e.target.value) })}
              />
            </label>
          </>
        )}
      </div>
      <div className={styles.editorShell}>
        <div
          className={styles.toolbar}
          role="toolbar"
          aria-label="본문 편집 도구"
        >
          {tools.map(([label, run]) => (
            <button type="button" key={label} onClick={run}>
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          >
            표
          </button>
          <button
            type="button"
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .insertContent({
                  type: 'callout',
                  attrs: { kind: 'checkpoint', title: '확인' },
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        { type: 'text', text: '확인할 내용을 입력하세요.' },
                      ],
                    },
                  ],
                })
                .run()
            }
          >
            체크포인트
          </button>
        </div>
        <div className={styles.editor}>
          <EditorContent editor={editor} />
        </div>
      </div>
      <div className={styles.saveBar}>
        <p
          aria-live="polite"
          className={`${styles.status} ${state === 'failed' ? styles.error : ''} ${state === 'saved' ? styles.success : ''}`}
        >
          {message}
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.primary}`}
            onClick={save}
            disabled={!editor || state === 'saving' || state === 'composing'}
          >
            Draft 저장
          </button>
          {localizationId ? (
            <a
              className={styles.textLink}
              href={`/admin/${kind === 'knowledge' ? 'knowledge' : 'lectures'}/${localizationId}/preview`}
            >
              미리보기
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
