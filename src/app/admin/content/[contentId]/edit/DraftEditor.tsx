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
import { DechiveImage } from '@/lib/editor/image-node';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import type { ContentType, Json } from '@/lib/supabase/database.types';
import { getContentSection } from '@/lib/content/catalog';
import { publishDraft, saveDraft } from '../../actions';

type DraftSnapshot = {
  title: string;
  slug: string;
  summary: string;
  metadata: Json;
  bodyJson: Json;
};

type JsonObject = { [key: string]: Json | undefined };

type SaveStatus = 'saved' | 'unsaved' | 'saving' | 'error' | 'conflict';
type PublishStatus = 'idle' | 'publishing' | 'published' | 'error';
type MediaStatus = 'idle' | 'uploading' | 'error';
type MediaPhase =
  | 'idle'
  | 'checking-session'
  | 'reading-file'
  | 'uploading-file'
  | 'saving-record'
  | 'inserting-body';

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

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MEDIA_PHASE_LABELS: Record<MediaPhase, string> = {
  idle: '',
  'checking-session': '로그인 상태를 확인하고 있습니다…',
  'reading-file': '이미지 정보를 확인하고 있습니다…',
  'uploading-file': '파일을 저장소에 올리고 있습니다…',
  'saving-record': '이미지 정보를 기록하고 있습니다…',
  'inserting-body': '본문에 이미지를 넣고 있습니다…',
};

function withTimeout<Result>(
  promise: PromiseLike<Result>,
  timeoutMs: number,
  message: string,
): Promise<Result> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error(message)), timeoutMs);

    Promise.resolve(promise).then(
      (result) => {
        window.clearTimeout(timeout);
        resolve(result);
      },
      (error: unknown) => {
        window.clearTimeout(timeout);
        reject(error);
      },
    );
  });
}

function imageExtension(mimeType: string) {
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  return 'gif';
}

async function sha256(file: File) {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function imageDimensions(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    return await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        const image = new Image();
        image.onload = () =>
          resolve({ width: image.naturalWidth, height: image.naturalHeight });
        image.onerror = () => reject(new Error('이미지를 읽을 수 없습니다.'));
        image.src = objectUrl;
      },
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function toLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function metadataObject(value: Json): JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value
    : {};
}

function metadataString(metadata: Json, key: string) {
  const value = metadataObject(metadata)[key];
  return typeof value === 'string' ? value : '';
}

function metadataLines(metadata: Json, key: string) {
  const value = metadataObject(metadata)[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string').join('\n')
    : '';
}

function metadataPairs(
  metadata: Json,
  key: string,
  firstKey: string,
  secondKey: string,
) {
  const value = metadataObject(metadata)[key];
  if (!Array.isArray(value)) return '';

  return value
    .flatMap((item) => {
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        return [];
      }
      const first = item[firstKey];
      const second = item[secondKey];
      return typeof first === 'string' && typeof second === 'string'
        ? [`${first} | ${second}`]
        : [];
    })
    .join('\n');
}

function toPairs(value: string, firstKey: string, secondKey: string): Json[] {
  return toLines(value).flatMap((line) => {
    const [first, ...rest] = line.split('|');
    const second = rest.join('|').trim();
    const firstValue = first?.trim();
    return firstValue && second
      ? [{ [firstKey]: firstValue, [secondKey]: second }]
      : [];
  });
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
  const [publishStatus, setPublishStatus] = useState<PublishStatus>('idle');
  const [publishMessage, setPublishMessage] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [mediaAlt, setMediaAlt] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaStatus, setMediaStatus] = useState<MediaStatus>('idle');
  const [mediaPhase, setMediaPhase] = useState<MediaPhase>('idle');
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);
  const [version, setVersion] = useState(initialVersion);
  const [saveRequest, setSaveRequest] = useState(0);
  const draftRef = useRef(draft);
  const versionRef = useRef(initialVersion);
  const changeNumberRef = useRef(0);
  const saveInFlightRef = useRef(false);
  const queuedSaveRef = useRef(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const markChanged = useCallback((next: DraftSnapshot) => {
    draftRef.current = next;
    changeNumberRef.current += 1;
    setDraft(next);
    setSaveStatus('unsaved');
    setSaveMessage(null);
    setPublishStatus('idle');
    setPublishMessage(null);
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
      metadata: snapshot.metadata,
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
      DechiveImage,
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

  useEffect(() => {
    return () => {
      if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    };
  }, [mediaPreviewUrl]);

  const updateField = <Key extends keyof DraftSnapshot>(
    key: Key,
    value: DraftSnapshot[Key],
  ) => {
    markChanged({ ...draftRef.current, [key]: value });
  };

  const updateMetadata = (key: string, value: Json) => {
    updateField('metadata', {
      ...metadataObject(draftRef.current.metadata),
      [key]: value,
    });
  };

  const runEditorCommand = (
    event: MouseEvent<HTMLButtonElement>,
    command: () => void,
  ) => {
    event.preventDefault();
    command();
  };

  const resetMediaForm = () => {
    if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    setMediaFile(null);
    setMediaPreviewUrl(null);
    setMediaAlt('');
    setMediaCaption('');
    setMediaStatus('idle');
    setMediaPhase('idle');
    setMediaError(null);
  };

  const selectMediaFile = (file: File | undefined) => {
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setMediaError('JPG, PNG, WebP, GIF 파일만 올릴 수 있습니다.');
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setMediaError('이미지는 한 장당 20MB 이하로 올려주세요.');
      return;
    }

    if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    setMediaFile(file);
    setMediaPreviewUrl(URL.createObjectURL(file));
    setMediaAlt('');
    setMediaCaption('');
    setMediaStatus('idle');
    setMediaPhase('idle');
    setMediaError(null);
  };

  const uploadAndInsertMedia = async () => {
    if (!mediaFile || !editor || mediaStatus === 'uploading') return;
    if (!mediaAlt.trim()) {
      setMediaError('이미지를 설명하는 대체 텍스트를 적어주세요.');
      return;
    }

    setMediaStatus('uploading');
    setMediaPhase('checking-session');
    setMediaError(null);

    const supabase = createBrowserClient();
    let uploadedObjectPath: string | null = null;
    let insertedAssetId: string | null = null;

    try {
      const {
        data: { user },
      } = await withTimeout(
        supabase.auth.getUser(),
        15_000,
        '로그인 확인이 지연되고 있습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.',
      );

      if (!user) {
        throw new Error('로그인 상태를 확인한 뒤 다시 시도해 주세요.');
      }

      setMediaPhase('reading-file');
      const [dimensions, checksum] = await withTimeout(
        Promise.all([imageDimensions(mediaFile), sha256(mediaFile)]),
        20_000,
        '이미지 파일을 읽지 못했습니다. 다른 이미지로 다시 시도해 주세요.',
      );
      const objectPath = `content/${contentId}/${crypto.randomUUID()}.${imageExtension(mediaFile.type)}`;
      uploadedObjectPath = objectPath;
      setMediaPhase('uploading-file');
      const uploadRequest = supabase.storage
        .from('dechive-public')
        .upload(objectPath, mediaFile, {
          cacheControl: '31536000',
          contentType: mediaFile.type,
          upsert: false,
        });
      const { error: uploadError } = await withTimeout(
        uploadRequest,
        60_000,
        '파일 업로드가 1분 안에 끝나지 않았습니다. 네트워크와 Supabase Storage 설정을 확인해 주세요.',
      );

      if (uploadError) throw uploadError;

      setMediaPhase('saving-record');
      const { data: asset, error: assetError } = await withTimeout(
        supabase
          .from('assets')
          .insert({
            bucket_id: 'dechive-public',
            object_path: objectPath,
            original_filename: mediaFile.name,
            mime_type: mediaFile.type,
            byte_size: mediaFile.size,
            width: dimensions.width,
            height: dimensions.height,
            alt_text: mediaAlt.trim(),
            checksum,
            uploaded_by: user.id,
          })
          .select('id')
          .single(),
        20_000,
        '이미지 정보 저장이 지연되고 있습니다. Supabase 권한 설정을 확인해 주세요.',
      );

      if (assetError || !asset) {
        throw assetError ?? new Error('이미지 기록을 만들지 못했습니다.');
      }
      insertedAssetId = asset.id;

      const publicUrl = supabase.storage
        .from('dechive-public')
        .getPublicUrl(objectPath).data.publicUrl;
      setMediaPhase('inserting-body');
      const inserted = editor
        .chain()
        .focus()
        .insertContent({
          type: 'image',
          attrs: {
            assetId: asset.id,
            src: publicUrl,
            alt: mediaAlt.trim(),
            caption: mediaCaption.trim(),
            width: dimensions.width,
            height: dimensions.height,
          },
        })
        .run();

      if (!inserted) {
        throw new Error('본문에 이미지를 삽입하지 못했습니다.');
      }

      insertedAssetId = null;
      uploadedObjectPath = null;
      resetMediaForm();
    } catch (error) {
      console.error('image upload failed', error);
      if (insertedAssetId) {
        void supabase.from('assets').delete().eq('id', insertedAssetId);
      }
      if (uploadedObjectPath) {
        void supabase.storage
          .from('dechive-public')
          .remove([uploadedObjectPath]);
      }
      setMediaStatus('error');
      setMediaPhase('idle');
      setMediaError(
        error instanceof Error
          ? error.message
          : '이미지를 올리지 못했습니다. 다시 시도해 주세요.',
      );
    }
  };

  const runPublish = async () => {
    if (saveStatus !== 'saved' || publishStatus === 'publishing') return;

    const confirmed = window.confirm(
      '현재 저장된 내용을 공개 사이트에 발행할까요?\n발행본은 revision으로 영구 보존됩니다.',
    );
    if (!confirmed) return;

    setPublishStatus('publishing');
    setPublishMessage(null);
    const result = await publishDraft({
      contentId,
      expectedVersion: versionRef.current,
    });

    if (result.ok) {
      setPublishStatus('published');
      setPublishMessage(`Revision ${result.revisionNumber} 발행 완료`);
      return;
    }

    setPublishStatus('error');
    setPublishMessage(result.error);
    if (result.conflict) setSaveStatus('conflict');
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
          <button
            className="publish-button"
            disabled={
              saveStatus !== 'saved' ||
              publishStatus === 'publishing' ||
              publishStatus === 'published'
            }
            onClick={() => void runPublish()}
            type="button"
          >
            {publishStatus === 'publishing'
              ? '발행 중…'
              : publishStatus === 'published'
                ? '발행 완료'
                : '공개 발행'}
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

          {contentType === 'knowledge' || contentType === 'lecture' ? (
            <label className="learning-objectives-field">
              <span>
                {contentType === 'knowledge'
                  ? '이 글에서 알아야 할 것'
                  : '이 강의에서 알아야 할 것'}
              </span>
              <textarea
                onChange={(event) =>
                  updateMetadata(
                    'learningObjectives',
                    toLines(event.target.value),
                  )
                }
                placeholder={'한 줄에 하나씩 적어주세요\n예: 생성형 AI와 일반 AI의 차이'}
                rows={4}
                value={metadataLines(draft.metadata, 'learningObjectives')}
              />
              <em>독자가 글을 읽고 분명히 알게 될 내용을 적습니다.</em>
            </label>
          ) : null}

          {contentType === 'lecture' ? (
            <section className="content-specific-fields" aria-label="강의 정보">
              <label>
                <span>강의 전반 설명</span>
                <textarea
                  onChange={(event) => updateMetadata('introduction', event.target.value)}
                  rows={5}
                  value={metadataString(draft.metadata, 'introduction')}
                />
              </label>
              <label>
                <span>YouTube 주소</span>
                <input
                  onChange={(event) => updateMetadata('youtubeUrl', event.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  type="url"
                  value={metadataString(draft.metadata, 'youtubeUrl')}
                />
              </label>
              <label>
                <span>주요 주제와 타임스탬프</span>
                <textarea
                  onChange={(event) => updateMetadata('timestamps', toPairs(event.target.value, 'time', 'label'))}
                  placeholder={'00:00 | 시작\n03:20 | 핵심 개념'}
                  rows={4}
                  value={metadataPairs(draft.metadata, 'timestamps', 'time', 'label')}
                />
              </label>
              <label>
                <span>강의자료</span>
                <textarea
                  onChange={(event) => updateMetadata('materials', toPairs(event.target.value, 'label', 'url'))}
                  placeholder={'자료 이름 | https://...'}
                  rows={4}
                  value={metadataPairs(draft.metadata, 'materials', 'label', 'url')}
                />
              </label>
            </section>
          ) : null}

          {contentType === 'practice' ? (
            <section className="content-specific-fields" aria-label="실습 정보">
              <label>
                <span>완성 결과 설명</span>
                <textarea
                  onChange={(event) => updateMetadata('resultDescription', event.target.value)}
                  rows={4}
                  value={metadataString(draft.metadata, 'resultDescription')}
                />
              </label>
              <label>
                <span>완성 결과 주소</span>
                <input
                  onChange={(event) => updateMetadata('demoUrl', event.target.value)}
                  placeholder="https://..."
                  type="url"
                  value={metadataString(draft.metadata, 'demoUrl')}
                />
              </label>
              <label>
                <span>필요한 것</span>
                <textarea
                  onChange={(event) => updateMetadata('requirements', event.target.value)}
                  rows={3}
                  value={metadataString(draft.metadata, 'requirements')}
                />
              </label>
              <label>
                <span>사용 도구</span>
                <textarea
                  onChange={(event) => updateMetadata('tools', toLines(event.target.value))}
                  placeholder="한 줄에 하나씩 적어주세요"
                  rows={3}
                  value={metadataLines(draft.metadata, 'tools')}
                />
              </label>
              <label>
                <span>예상 비용</span>
                <input
                  onChange={(event) => updateMetadata('estimatedCost', event.target.value)}
                  value={metadataString(draft.metadata, 'estimatedCost')}
                />
              </label>
            </section>
          ) : null}

          {contentType === 'ai_update' ? (
            <section className="content-specific-fields" aria-label="AI 업데이트 정보">
              <label>
                <span>변경 날짜</span>
                <input
                  onChange={(event) => updateMetadata('updateDate', event.target.value)}
                  type="date"
                  value={metadataString(draft.metadata, 'updateDate')}
                />
              </label>
              <label>
                <span>확인할 변화 요약</span>
                <textarea
                  onChange={(event) => updateMetadata('changeSummary', event.target.value)}
                  rows={5}
                  value={metadataString(draft.metadata, 'changeSummary')}
                />
              </label>
            </section>
          ) : null}

          {contentType === 'book' ? (
            <section className="content-specific-fields book-editor-fields" aria-label="전자책 정보">
              <label><span>저자</span><input onChange={(event) => updateMetadata('author', event.target.value)} value={metadataString(draft.metadata, 'author')} /></label>
              <label><span>출판사</span><input onChange={(event) => updateMetadata('publisher', event.target.value)} value={metadataString(draft.metadata, 'publisher')} /></label>
              <label><span>출간일</span><input onChange={(event) => updateMetadata('publicationDate', event.target.value)} type="date" value={metadataString(draft.metadata, 'publicationDate')} /></label>
              <label><span>ISBN</span><input onChange={(event) => updateMetadata('isbn', event.target.value)} value={metadataString(draft.metadata, 'isbn')} /></label>
              <label><span>페이지 수</span><input min="1" onChange={(event) => updateMetadata('pageCount', Number(event.target.value) || null)} type="number" value={typeof metadataObject(draft.metadata).pageCount === 'number' ? String(metadataObject(draft.metadata).pageCount) : ''} /></label>
              <label><span>형식</span><input onChange={(event) => updateMetadata('format', event.target.value)} placeholder="종이책, PDF, EPUB" value={metadataString(draft.metadata, 'format')} /></label>
              <label>
                <span>외부 판매처</span>
                <textarea onChange={(event) => updateMetadata('purchaseLinks', toPairs(event.target.value, 'store', 'url'))} placeholder={'교보문고 | https://...\n알라딘 | https://...'} rows={4} value={metadataPairs(draft.metadata, 'purchaseLinks', 'store', 'url')} />
              </label>
              <label>
                <span>목차</span>
                <textarea onChange={(event) => updateMetadata('tableOfContents', toLines(event.target.value))} placeholder="한 줄에 하나씩 적어주세요" rows={5} value={metadataLines(draft.metadata, 'tableOfContents')} />
              </label>
              <label>
                <span>미리보기</span>
                <textarea onChange={(event) => updateMetadata('preview', event.target.value)} rows={5} value={metadataString(draft.metadata, 'preview')} />
              </label>
            </section>
          ) : null}

          <section className="body-editor" aria-label="본문 에디터">
            <div className="editor-toolbar" role="toolbar" aria-label="본문 서식">
              <button
                aria-pressed={editor?.isActive('paragraph') ?? false}
                disabled={!editor}
                onMouseDown={(event) =>
                  runEditorCommand(event, () =>
                    editor?.chain().focus().setParagraph().run(),
                  )
                }
                title="현재 문단을 본문으로 바꾸기"
                type="button"
              >
                본문
              </button>
              <button
                aria-pressed={editor?.isActive('heading', { level: 2 }) ?? false}
                disabled={!editor}
                onMouseDown={(event) =>
                  runEditorCommand(event, () =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run(),
                  )
                }
                title="현재 문단을 큰 소제목으로 바꾸기"
                type="button"
              >
                H2
              </button>
              <button
                aria-pressed={editor?.isActive('heading', { level: 3 }) ?? false}
                disabled={!editor}
                onMouseDown={(event) =>
                  runEditorCommand(event, () =>
                    editor?.chain().focus().toggleHeading({ level: 3 }).run(),
                  )
                }
                title="현재 문단을 작은 소제목으로 바꾸기"
                type="button"
              >
                H3
              </button>
              <button
                aria-pressed={editor?.isActive('bold') ?? false}
                disabled={!editor}
                onMouseDown={(event) =>
                  runEditorCommand(event, () =>
                    editor?.chain().focus().toggleBold().run(),
                  )
                }
                title="선택한 글자를 굵게"
                type="button"
              >
                굵게
              </button>
              <button
                aria-pressed={editor?.isActive('italic') ?? false}
                disabled={!editor}
                onMouseDown={(event) =>
                  runEditorCommand(event, () =>
                    editor?.chain().focus().toggleItalic().run(),
                  )
                }
                title="선택한 글자를 기울임꼴로"
                type="button"
              >
                기울임
              </button>
              <button
                aria-pressed={editor?.isActive('bulletList') ?? false}
                disabled={!editor}
                onMouseDown={(event) =>
                  runEditorCommand(event, () =>
                    editor?.chain().focus().toggleBulletList().run(),
                  )
                }
                title="현재 문단을 글머리표 목록으로"
                type="button"
              >
                목록
              </button>
              <button
                aria-pressed={editor?.isActive('blockquote') ?? false}
                disabled={!editor}
                onMouseDown={(event) =>
                  runEditorCommand(event, () =>
                    editor?.chain().focus().toggleBlockquote().run(),
                  )
                }
                title="현재 문단을 인용문으로"
                type="button"
              >
                인용
              </button>
              <input
                accept="image/jpeg,image/png,image/webp,image/gif"
                aria-label="삽입할 이미지 또는 GIF 선택"
                className="visually-hidden"
                onChange={(event) => {
                  selectMediaFile(event.target.files?.[0]);
                  event.target.value = '';
                }}
                ref={mediaInputRef}
                type="file"
              />
              <button
                aria-pressed={Boolean(mediaFile)}
                disabled={!editor || mediaStatus === 'uploading'}
                onMouseDown={(event) => {
                  event.preventDefault();
                  mediaInputRef.current?.click();
                }}
                title="JPG, PNG, WebP, GIF 삽입"
                type="button"
              >
                이미지·GIF
              </button>
              <span />
              <button
                disabled={!editor?.can().undo()}
                onMouseDown={(event) =>
                  runEditorCommand(event, () =>
                    editor?.chain().focus().undo().run(),
                  )
                }
                title="마지막 본문 편집 취소"
                type="button"
              >
                실행 취소
              </button>
              <button
                disabled={!editor?.can().redo()}
                onMouseDown={(event) =>
                  runEditorCommand(event, () =>
                    editor?.chain().focus().redo().run(),
                  )
                }
                title="취소한 본문 편집 다시 실행"
                type="button"
              >
                다시 실행
              </button>
            </div>
            <p className="editor-toolbar-help">
              본문에 커서를 둔 뒤 문단 형식을 고르거나, 글자를 선택해 굵게·기울임을 적용하세요.
            </p>
            {mediaFile && mediaPreviewUrl ? (
              <section className="media-insert-panel" aria-label="이미지 삽입 정보">
                {/* Local object URL used only before the upload is confirmed. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mediaPreviewUrl} alt="삽입 전 미리보기" />
                <div>
                  <strong>{mediaFile.name}</strong>
                  <label>
                    <span>대체 텍스트</span>
                    <input
                      onChange={(event) => setMediaAlt(event.target.value)}
                      placeholder="이미지에서 무엇을 볼 수 있는지 설명"
                      value={mediaAlt}
                    />
                  </label>
                  <label>
                    <span>캡션</span>
                    <input
                      onChange={(event) => setMediaCaption(event.target.value)}
                      placeholder="본문 아래에 표시할 설명—선택 사항"
                      value={mediaCaption}
                    />
                  </label>
                  {mediaError ? <p role="alert">{mediaError}</p> : null}
                  {mediaStatus === 'uploading' ? (
                    <p className="media-upload-progress" role="status">
                      {MEDIA_PHASE_LABELS[mediaPhase]}
                    </p>
                  ) : null}
                  <div className="media-insert-actions">
                    <button
                      disabled={mediaStatus === 'uploading'}
                      onClick={resetMediaForm}
                      type="button"
                    >
                      취소
                    </button>
                    <button
                      disabled={mediaStatus === 'uploading'}
                      onClick={() => void uploadAndInsertMedia()}
                      type="button"
                    >
                      {mediaStatus === 'uploading'
                        ? '처리 중…'
                        : '본문에 삽입'}
                    </button>
                  </div>
                </div>
              </section>
            ) : mediaError ? (
              <p className="media-standalone-error" role="alert">
                {mediaError}
              </p>
            ) : null}
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
          {publishMessage ? (
            <p
              className={`publish-message is-${publishStatus}`}
              role={publishStatus === 'error' ? 'alert' : 'status'}
            >
              {publishMessage}
            </p>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
