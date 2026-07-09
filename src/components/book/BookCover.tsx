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
        className={`aspect-[3/4] border border-white/10 bg-white/[0.035] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.22)] ${className}`}
      >
        <div className="flex h-full flex-col justify-between border border-[#d7ad73]/28 p-4">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[#f6d29b]/72 uppercase">
            Dechive Book
          </p>
          <p className="font-[family-name:var(--font-header-serif)] text-xl leading-tight text-[#f5ead5]">
            {title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[3/4] overflow-hidden border border-white/10 bg-white/[0.035] shadow-[0_18px_45px_rgba(0,0,0,0.22)] ${className}`}
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
