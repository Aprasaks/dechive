import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center min-h-[calc(100vh-64px-56px)]">
      <div className="relative w-32 h-32 mb-8 opacity-60">
        <Image
          src="/images/archive.webp"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-4">
        404
      </p>
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 mb-4">
        페이지를 찾을 수 없어요.
      </h1>
      <p className="text-base text-zinc-400 mb-10">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="rounded-full bg-white/10 hover:bg-white/20 px-6 py-2.5 text-sm font-medium text-zinc-100 transition-all"
        >
          홈으로
        </Link>
        <Link
          href="/archive"
          className="rounded-full border border-white/10 hover:border-white/20 px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-all"
        >
          Archive 보기
        </Link>
      </div>
    </main>
  );
}
