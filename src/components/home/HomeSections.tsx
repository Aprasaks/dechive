import Link from 'next/link';
import { ArrowRight, BookOpen, FlaskConical, GraduationCap, Newspaper, LibraryBig } from 'lucide-react';

const entries = [
  ['Knowledge', '무엇을 이해하고 검증해야 하는지 기록한 지식 문서입니다.', '/knowledge', BookOpen],
  ['Lecture', '지식을 다른 사람에게 어떤 순서와 방식으로 설명할지 정리한 공개 강의 자료입니다.', '/lecture', GraduationCap],
  ['Practice', '지식을 직접 적용하고 결과를 확인하는 실습·적용 기록입니다.', '/practice', FlaskConical],
  ['AI Update', '기록할 가치가 있는 AI 제품과 생태계의 변화를 정리합니다.', '/ai-update', Newspaper],
  ['Books', '축적된 지식을 하나의 완성된 책으로 정리한 공개 결과물입니다.', '/books', LibraryBig],
] as const;

export function HomeSections({ heroSerifClassName }: { heroSerifClassName: string }) {
  return <><section className="page-shell py-[var(--section-space)]"><div className="max-w-3xl"><p className="text-accent text-sm font-semibold tracking-[.14em] uppercase">DECHIVE</p><h1 id="home-title" className={`${heroSerifClassName} mt-6 text-[clamp(2.8rem,7vw,5.8rem)] leading-[1.12] font-medium tracking-[-.06em] break-keep`}>공부하고, 검증하고,<br />다시 설명하는 AI</h1><p className="text-secondary-foreground mt-7 max-w-2xl text-base leading-8 sm:text-lg sm:leading-9">Dechive는 사람이 직접 이해한 내용을 지식, 강의, 실습과 변화 기록으로 다시 구성하는 공간입니다.</p></div></section><section className="border-y border-border bg-surface" aria-labelledby="public-areas"><div className="page-shell py-14"><p className="text-accent text-xs font-semibold tracking-[.14em] uppercase">Public areas</p><h2 id="public-areas" className="mt-3 text-3xl font-semibold tracking-[-.04em]">필요한 방식으로 살펴보세요</h2><div className="mt-10 grid border-b border-border md:grid-cols-2 lg:grid-cols-5">{entries.map(([title, description, href, Icon])=><Link key={href} href={href} className="group min-h-64 border-t border-border p-6 transition-colors hover:bg-accent-soft"><Icon className="text-accent" size={22} strokeWidth={1.5} aria-hidden="true"/><h3 className="mt-8 text-xl font-semibold">{title}</h3><p className="text-secondary-foreground mt-3 text-sm leading-7 break-keep">{description}</p><span className="text-accent mt-7 inline-flex items-center gap-2 text-sm font-semibold">둘러보기 <ArrowRight size={15} aria-hidden="true"/></span></Link>)}</div></div></section></>;
}
