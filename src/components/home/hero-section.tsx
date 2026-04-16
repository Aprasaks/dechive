import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';

export default function HeroSection() {
  const totalPosts = getAllPosts('ko').length;

  return (
    <section className="relative w-full overflow-hidden rounded-3xl border border-white/10 px-12 py-28 md:px-20 md:py-36">
      {/* 배경 이미지 */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none">
        <Image
          src="/images/coded-library.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom brightness-[0.55]"
          priority
          quality={75}
        />
        {/* 텍스트 가독성 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-20 flex flex-col gap-8 max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">
          Demian
        </p>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
          지식은 기록하는 순간<br />
          <span className="text-zinc-400">가치가 됩니다.</span>
        </h1>

        <p className="text-sm leading-relaxed text-zinc-400 max-w-md">
          기술·철학·사유의 흔적을 정제하고 기록하는 무한서고.
          <span className="ml-2 text-zinc-600">{totalPosts}편 수록</span>
        </p>

        <div className="flex items-center gap-8 pt-2">
          <Link
            href="/archive"
            className="text-sm font-medium text-zinc-200 transition-colors hover:text-white"
          >
            서고 입장 →
          </Link>
          <Link
            href="/about"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            소개 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
