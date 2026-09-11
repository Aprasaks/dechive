'use client';

import { useActionState } from 'react';
import { CONTENT_SECTIONS } from '@/lib/content/catalog';
import { createContent, type CreateContentState } from '../actions';

const initialState: CreateContentState = { error: null };

export function NewContentForm() {
  const [state, formAction, pending] = useActionState(
    createContent,
    initialState,
  );

  return (
    <form action={formAction} className="new-content-form">
      <fieldset>
        <legend>무엇을 작성할까요?</legend>
        <div className="content-type-options">
          {CONTENT_SECTIONS.map((section, index) => (
            <label key={section.type}>
              <input
                defaultChecked={index === 0}
                name="type"
                type="radio"
                value={section.type}
              />
              <span>
                <small>{section.index}</small>
                <strong>{section.label}</strong>
                <em>{section.description}</em>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="new-content-title" htmlFor="new-content-title">
        <span>제목</span>
        <input
          autoFocus
          id="new-content-title"
          name="title"
          placeholder="무엇을 설명할지 한 문장으로 적어주세요"
          required
          type="text"
        />
      </label>

      {state.error ? <p role="alert">{state.error}</p> : null}

      <div className="new-content-actions">
        <p>주소는 먼저 안전하게 생성하고, 에디터에서 바꿀 수 있습니다.</p>
        <button disabled={pending} type="submit">
          {pending ? '초안 만드는 중…' : '글쓰기 시작'}
        </button>
      </div>
    </form>
  );
}
