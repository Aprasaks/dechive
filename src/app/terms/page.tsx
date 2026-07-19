import type { Metadata } from 'next';
export const metadata:Metadata={title:'Terms',description:'Dechive 이용약관 안내.',alternates:{canonical:'https://dechive.dev/terms'}};
export default function TermsPage(){return <main id="main-content" className="page-shell py-[var(--section-space)]"><h1 className="text-4xl font-semibold tracking-[-.05em]">Terms</h1><p className="text-secondary-foreground mt-6 max-w-2xl leading-8">Dechive의 공개 콘텐츠 이용 기준을 안내합니다. 회원가입, 결제, 유료 콘텐츠 기능은 현재 제공하지 않습니다.</p></main>}
