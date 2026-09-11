'use client';

import { useActionState } from 'react';
import { login, type LoginState } from './actions';

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="admin-login-form">
      <label htmlFor="email">이메일</label>
      <input
        autoComplete="email"
        id="email"
        name="email"
        required
        type="email"
      />
      <label htmlFor="password">비밀번호</label>
      <input
        autoComplete="current-password"
        id="password"
        name="password"
        required
        type="password"
      />
      {state.error ? <p role="alert">{state.error}</p> : null}
      <button disabled={pending} type="submit">
        {pending ? '확인 중…' : '관리자 로그인'}
      </button>
    </form>
  );
}
