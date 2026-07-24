'use client';

import KnowledgeHelixScene from '@/components/home/KnowledgeHelixScene';

const KNOWLEDGE_MARKERS = [
  {
    title: 'Archive',
    className: 'left-[10%] top-[24%]',
    delay: '0s',
  },
  {
    title: 'DeepDive',
    className: 'right-[9%] top-[36%]',
    delay: '4s',
  },
  {
    title: 'Book',
    className: 'left-[10%] bottom-[25%]',
    delay: '8s',
  },
] as const;

export default function KnowledgeHelix() {
  return (
    <figure className="relative mx-auto hidden aspect-[650/820] w-full max-w-[35rem] overflow-visible lg:block">
      <style>
        {`
          @keyframes dechive-knowledge-marker {
            0%, 3% {
              opacity: 0;
              transform: translate3d(0, 22px, 0) scale(0.98);
            }
            8%, 17% {
              opacity: 0.92;
              transform: translate3d(0, 0, 0) scale(1);
            }
            23%, 100% {
              opacity: 0;
              transform: translate3d(0, -24px, 0) scale(1.01);
            }
          }

          .dechive-knowledge-marker {
            animation: dechive-knowledge-marker 16s ease-in-out infinite;
            animation-fill-mode: both;
            opacity: 0;
          }

          @media (prefers-reduced-motion: reduce) {
            .dechive-knowledge-marker {
              animation: none;
              opacity: 0.62;
              transform: none;
            }
          }
        `}
      </style>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[55%] h-[68%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(246,210,155,0.18),rgba(246,210,155,0.055)_38%,transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 bottom-[4%] h-[20%] w-[86%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(246,210,155,0.18),rgba(246,210,155,0.045)_45%,transparent_72%)] blur-xl"
      />
      <KnowledgeHelixScene />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {KNOWLEDGE_MARKERS.map((marker) => (
          <div
            key={marker.title}
            className={`dechive-knowledge-marker absolute font-[cursive] text-[1.35rem] leading-none font-normal text-[#f6d29b]/82 italic tracking-[0.03em] drop-shadow-[0_0_16px_rgba(246,210,155,0.16)] ${marker.className}`}
            style={{ animationDelay: marker.delay }}
          >
            {marker.title}
          </div>
        ))}
      </div>
    </figure>
  );
}
