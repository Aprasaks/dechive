import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-8 text-4xl font-bold tracking-tighter italic">
        Dechive_
      </h1>
      <ThemeToggle />
      <p className="mt-4 text-zinc-500">
        테마를 클릭해서 배경과 글자색이 바뀌는지 확인해 보세요!
      </p>
    </main>
  );
}
