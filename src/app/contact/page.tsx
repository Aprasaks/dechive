import type { Metadata } from 'next';
export const metadata:Metadata={title:'Contact',description:'Dechive 문의 안내.',alternates:{canonical:'https://dechive.dev/contact'}};
export default function ContactPage(){return <main id="main-content" className="page-shell py-[var(--section-space)]"><h1 className="text-4xl font-semibold tracking-[-.05em]">Contact</h1><p className="text-secondary-foreground mt-6 max-w-2xl leading-8">Dechive 관련 문의 채널을 준비하고 있습니다.</p></main>}
