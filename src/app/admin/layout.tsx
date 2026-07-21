import type { ReactNode } from 'react';

export const preferredRegion = 'sin1';
// 어드민은 DB를 읽는 비공개 화면이므로 빌드 시 정적 프리렌더 대상에서 제외한다
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
