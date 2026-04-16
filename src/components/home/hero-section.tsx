import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl">
      {/* 배경 이미지 */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none">
        <Image
          src="/images/coded-library.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.75]"
          priority
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-20 flex min-h-[500px] flex-col justify-center gap-12 px-10 py-16 md:flex-row md:items-center md:justify-between md:px-16 md:py-20">

        {/* 헤드라인 */}
        <div className="flex flex-col gap-4">
          {/* 앰버 액센트 라인 */}
          <div className="h-px w-12" style={{ background: 'linear-gradient(to right, #c9963a, transparent)' }} />
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
            지식은 기록하는 순간<br />
            <span className="text-zinc-300">가치가 됩니다.</span>
          </h1>
        </div>

        {/* 버튼 */}
        <div className="flex shrink-0 flex-col gap-3">
          {/* 메인 버튼 — 황금빛 앰버 */}
          <Link
            href="/archive"
            className="inline-flex items-center justify-center rounded-xl px-10 py-4 text-sm font-bold text-zinc-950 whitespace-nowrap transition-all hover:brightness-110 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #d4a843, #c9963a)' }}
          >
            서고 입장 →
          </Link>
          {/* 서브 버튼 — 유리 */}
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-10 py-4 text-sm font-medium text-zinc-200 backdrop-blur-md transition-all hover:bg-white/15 hover:border-white/30 hover:text-white whitespace-nowrap"
          >
            소개 보기
          </Link>
        </div>

      </div>
    </section>
  );
}
