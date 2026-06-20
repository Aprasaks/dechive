import Image from 'next/image';

interface BookCoverProps {
  src: string;
  title: string;
  className?: string;
  priority?: boolean;
}

export default function BookCover({
  src,
  title,
  className = '',
  priority = false,
}: BookCoverProps) {
  if (!src) {
    return (
      <div
        className={`aspect-[3/4] border border-[#d8c9b0] bg-[#efe7da] p-4 shadow-[0_18px_45px_rgba(42,33,27,0.08)] ${className}`}
      >
        <div className="flex h-full flex-col justify-between border border-[#cbb899]/55 p-4">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[#9a7342] uppercase">
            Dechive Book
          </p>
          <p className="font-[family-name:var(--font-header-serif)] text-xl leading-tight text-[#2a211b]">
            {title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[3/4] overflow-hidden border border-[#d8c9b0] bg-[#efe7da] shadow-[0_18px_45px_rgba(42,33,27,0.08)] ${className}`}
    >
      <Image
        src={src}
        alt={`${title} 표지`}
        fill
        sizes="(min-width: 768px) 180px, 40vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
