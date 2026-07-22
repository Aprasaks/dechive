/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import type { JSONContent } from '@tiptap/core';
import { Fragment } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
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
import type { KnowledgeHero } from '@/services/media-assets';
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
  hero: KnowledgeHero | null;
  heroImageUrl?: string | null;
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
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'knowledge';
const mediaMessages: Record<string, string> = {
  media_file_required: '이미지 파일을 선택하세요.',
  media_file_size_invalid: '이미지 파일은 10MB 이하만 업로드할 수 있습니다.',
  media_request_size_invalid: '업로드 요청이 너무 큽니다.',
  media_type_invalid: 'JPEG, PNG, WebP 이미지만 업로드할 수 있습니다.',
  media_mime_mismatch: '파일 형식과 이미지 내용이 일치하지 않습니다.',
  media_dimensions_invalid: '이미지 크기를 확인해 주세요.',
  admin_access_denied: '이미지 업로드 권한이 없습니다.',
  media_storage_provider_missing_or_invalid: '이미지 저장소 설정을 확인해 주세요.',
};
const humanMediaMessage = (value: string) => mediaMessages[value] ?? '이미지를 업로드하지 못했습니다.';

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
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [tagDraft, setTagDraft] = useState('');
  const [tagMessage, setTagMessage] = useState('');
  const [selectedFigure, setSelectedFigure] = useState<{ mediaId: string; alt: string; caption: string } | null>(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadAiGenerated, setUploadAiGenerated] = useState(true);
  const [uploadAsHero, setUploadAsHero] = useState(false);
  const [insertInBody, setInsertInBody] = useState(true);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const uploadInput = useRef<HTMLInputElement>(null);
  const composing = useRef(false);
  useEffect(() => {
    if (!['dirty', 'composing', 'saving'].includes(state)) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [state]);
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
        setMessage('저장되지 않은 변경사항');
      }
    },
    onSelectionUpdate: ({ editor: current }) => {
      const node = current.state.selection instanceof NodeSelection ? current.state.selection.node : null;
      if (node?.type.name === 'figure') {
        setSelectedFigure({
          mediaId: typeof node.attrs.mediaId === 'string' ? node.attrs.mediaId : '',
          alt: typeof node.attrs.alt === 'string' ? node.attrs.alt : '',
          caption: typeof node.attrs.caption === 'string' ? node.attrs.caption : '',
        });
      } else {
        setSelectedFigure(null);
      }
    },
  });
  const dirty = (patch: Record<string, unknown>) => {
    setFields((current) => ({ ...current, ...patch }) as typeof current);
    setState('dirty');
    setMessage('저장되지 않은 변경사항');
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
      setMessage(`저장 실패: ${result.error === 'slug_invalid' ? 'slug 형식을 확인해 주세요.' : '입력 내용을 확인해 주세요.'}`);
      return;
    }
    setState('saved');
    setMessage(`저장 완료 · 버전 ${result.versionNumber}`);
    if (mode === 'create')
      window.location.assign(
        `/admin/${kind === 'knowledge' ? 'knowledge' : 'lectures'}/${result.localizationId}/edit`,
      );
  };
  const updateReference = (
    index: number,
    patch: Partial<KnowledgeReference>,
  ) => {
    const references = (fields as LectureFields).references.map(
      (reference, at) =>
        at === index ? { ...reference, ...patch } : reference,
    );
    dirty({ references });
  };
  const addReference = () =>
    dirty({
      references: [
        ...(fields as LectureFields).references,
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
      references: (fields as LectureFields).references.filter(
        (_, at) => at !== index,
      ),
    });
  const updateSelectedFigure = (patch: { alt?: string; caption?: string }) => {
    if (!editor || !(editor.state.selection instanceof NodeSelection) || editor.state.selection.node?.type.name !== 'figure') return;
    const selection = editor.state.selection;
    const node = selection.node;
    if (!node) return;
    const attrs = { ...node.attrs, ...patch };
    let content = node.content;
    if (Object.prototype.hasOwnProperty.call(patch, 'caption')) {
      const caption = String(patch.caption ?? '').trim();
      const captionType = editor.schema.nodes.caption;
      content = caption && captionType ? Fragment.from(captionType.create(null, editor.schema.text(caption))) : Fragment.empty;
    }
    const replacement = node.type.create(attrs, content);
    editor.view.dispatch(editor.state.tr.replaceWith(selection.from, selection.to, replacement));
    const nextAttrs = attrs as Record<string, unknown>;
    setSelectedFigure({ mediaId: String(nextAttrs.mediaId ?? ''), alt: String(nextAttrs.alt ?? ''), caption: String(nextAttrs.caption ?? '') });
    setState('dirty');
    setMessage('미저장 변경 있음');
  };
  const addTags = (value: string) => {
    const incoming = value.split(',').map((tag) => tag.trim()).filter(Boolean);
    if (!incoming.length) return;
    const tags = [...new Set([...knowledgeFields.tags, ...incoming])];
    if (tags.length > 12) {
      setTagMessage('태그는 최대 12개까지 입력할 수 있습니다.');
      return;
    }
    dirty({ tags });
    setTagDraft('');
    setTagMessage('');
  };
  const removeTag = (tag: string) => dirty({ tags: knowledgeFields.tags.filter((item) => item !== tag) });
  const removeSelectedFigure = () => {
    if (!editor || !(editor.state.selection instanceof NodeSelection) || editor.state.selection.node?.type.name !== 'figure') return;
    const selection = editor.state.selection;
    editor.view.dispatch(editor.state.tr.delete(selection.from, selection.to));
    setSelectedFigure(null);
    setState('dirty');
    setMessage('저장되지 않은 변경사항');
  };
  const uploadImage = async () => {
    const file = uploadFile ?? uploadInput.current?.files?.[0];
    if (!file) { setUploadMessage('이미지 파일을 선택하세요.'); return; }
    if (!uploadAlt.trim()) { setUploadMessage('alt는 필수입니다.'); return; }
    setUploading(true); setUploadMessage('업로드 중');
    try {
      const form = new FormData();
      form.set('file', file);
      form.set('aiGenerated', String(uploadAiGenerated));
      const response = await fetch('/api/admin/media', { method: 'POST', body: form });
      const result = (await response.json()) as { ok: boolean; error?: string; asset?: { id: string; publicUrl: string; width: number; height: number } };
      if (!response.ok || !result.ok || !result.asset) throw new Error(result.error ?? 'media_upload_failed');
      const hero = uploadAsHero ? { mediaId: result.asset.id, alt: uploadAlt.trim(), caption: uploadCaption.trim() } : knowledgeFields.hero;
      if (uploadAsHero) dirty({ hero, heroImageUrl: result.asset.publicUrl });
      if (insertInBody && kind === 'knowledge') {
        editor?.chain().focus().insertContent({ type: 'figure', attrs: { mediaId: result.asset.id, src: result.asset.publicUrl, media: { id: result.asset.id, displayUrl: result.asset.publicUrl, width: result.asset.width, height: result.asset.height }, alt: uploadAlt.trim(), caption: uploadCaption.trim(), alignment: 'center', width: 100, sourceReferenceId: null }, content: uploadCaption.trim() ? [{ type: 'caption', content: [{ type: 'text', text: uploadCaption.trim() }] }] : [] }).run();
      }
      setUploadMessage('이미지 업로드 완료');
      setUploadAlt(''); setUploadCaption(''); setUploadAsHero(false); setUploadAiGenerated(true);
      setUploadFile(null);
      if (uploadInput.current) uploadInput.current.value = '';
    } catch (error) {
      setUploadMessage(humanMediaMessage(error instanceof Error ? error.message : 'media_upload_failed'));
    } finally { setUploading(false); }
  };
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
            onChange={(e) => dirty({ title: e.target.value, ...(kind === 'knowledge' && mode === 'create' && !slugTouched ? { slug: slugify(e.target.value) } : {}) })}
            required
          />
        </label>
        {kind !== 'knowledge' ? (
          <label className={styles.field}>
            Slug
            <input value={fields.slug} onChange={(e) => dirty({ slug: e.target.value })} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required />
          </label>
        ) : null}
        <label className={`${styles.field} ${styles.fieldWide}`}>
          요약
          <textarea
            rows={3}
            value={fields.summary}
            onChange={(e) => dirty({ summary: e.target.value })}
            required
          />
          <small>목록, 검색 결과, SNS 공유 및 글 소개에 사용됩니다.</small>
        </label>
        {kind === 'knowledge' ? (
          <>
            <label className={`${styles.field} ${styles.fieldWide}`}>
              태그
              <div className={styles.tagEditor}>
                <div className={styles.tagList} aria-label="입력한 태그">
                  {knowledgeFields.tags.map((tag) => <span className={styles.tagChip} key={tag}>{tag}<button type="button" onClick={() => removeTag(tag)} aria-label={`${tag} 태그 삭제`}>×</button></span>)}
                </div>
                <input value={tagDraft} onChange={(event) => { if (event.target.value.includes(',')) addTags(event.target.value); else setTagDraft(event.target.value); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ',') { event.preventDefault(); addTags(tagDraft); } }} onBlur={() => addTags(tagDraft)} placeholder="Enter 또는 쉼표로 추가, 최대 12개" />
              </div>
              <small>태그는 중복 없이 저장되며 최대 12개까지 입력할 수 있습니다.</small>
              {tagMessage ? <small className={styles.error}>{tagMessage}</small> : null}
            </label>
            <details className={`${styles.field} ${styles.fieldWide} ${styles.advanced}`} open={slugLocked}>
              <summary>고급 설정</summary>
              <label>Slug<input value={fields.slug} onChange={(event) => { setSlugTouched(true); dirty({ slug: event.target.value }); }} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required disabled={slugLocked} /></label>
              <small>{slugLocked ? '이미 발행된 글의 slug는 변경할 수 없습니다.' : '제목에서 자동 생성되며 필요할 때 직접 수정할 수 있습니다.'}</small>
              {slugLocked ? <p className={styles.warning}>발행 후 slug 변경은 기존 공개 URL에 영향을 줄 수 있어 잠겨 있습니다.</p> : null}
            </details>
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
      {kind === 'knowledge' ? (
        <section className={styles.mediaPanel} aria-label="이미지">
          <h2>이미지</h2>
          {knowledgeFields.hero ? (
            <div className={styles.heroPreview}>
              {knowledgeFields.heroImageUrl ? <img src={knowledgeFields.heroImageUrl} alt={knowledgeFields.hero.alt} /> : null}
              <div><strong>대표 이미지</strong><p>{knowledgeFields.hero.alt}</p><button type="button" className={styles.button} onClick={() => dirty({ hero: null, heroImageUrl: null })}>대표 이미지 해제</button></div>
            </div>
          ) : <p>대표 이미지가 없습니다.</p>}
          <div className={styles.mediaUploadGrid}>
            <label className={styles.field}>이미지 파일<input ref={uploadInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)} /></label>
            <label className={styles.field}>alt <input value={uploadAlt} onChange={(event) => setUploadAlt(event.target.value)} required placeholder="이미지의 내용을 설명하세요" /></label>
            <label className={styles.field}>캡션 <input value={uploadCaption} onChange={(event) => setUploadCaption(event.target.value)} placeholder="선택 사항" /></label>
            <label className={styles.checkbox}><input type="checkbox" checked={uploadAiGenerated} onChange={(event) => setUploadAiGenerated(event.target.checked)} /> AI 생성 이미지</label>
            <label className={styles.checkbox}><input type="checkbox" checked={uploadAsHero} onChange={(event) => setUploadAsHero(event.target.checked)} /> 대표 이미지로 사용</label>
            <label className={styles.checkbox}><input type="checkbox" checked={insertInBody} onChange={(event) => setInsertInBody(event.target.checked)} /> 본문에도 삽입</label>
            <button type="button" className={`${styles.button} ${styles.primary}`} disabled={uploading || !uploadFile || !uploadAlt.trim()} onClick={uploadImage}>{uploading ? '업로드 중…' : '이미지 업로드'}</button>
          </div>
          <p role="status">{uploadMessage}</p>
          {selectedFigure ? (
            <div className={styles.selectedImage}>
              <strong>선택한 본문 이미지</strong>
              <label className={styles.field}>alt <input value={selectedFigure.alt} onChange={(event) => { setSelectedFigure({ ...selectedFigure, alt: event.target.value }); updateSelectedFigure({ alt: event.target.value }); }} required /></label>
              <label className={styles.field}>캡션 <input value={selectedFigure.caption} onChange={(event) => { setSelectedFigure({ ...selectedFigure, caption: event.target.value }); updateSelectedFigure({ caption: event.target.value }); }} /></label>
              <button type="button" className={styles.button} onClick={removeSelectedFigure}>본문 이미지 제거</button>
            </div>
          ) : null}
        </section>
      ) : null}
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
            임시 저장
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
