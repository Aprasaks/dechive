interface DechiveSectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
}

export default function DechiveSectionHeader({
  eyebrow,
  title,
  description,
  meta,
}: DechiveSectionHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#d7ad73]/10 bg-[#030303] text-[#f3eadb]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(215,173,115,0.11),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(255,255,255,0.035),transparent_30%),linear-gradient(180deg,#030303_0%,#050505_100%)]"
      />
      <div className="mx-auto max-w-[92rem] px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <div className="max-w-4xl">
          <p className="inline-flex rounded-full border border-[#c89b62]/25 bg-[#c89b62]/8 px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-[#d7ad73] uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-6 font-[family-name:var(--font-header-serif)] text-[2.55rem] leading-[1.04] font-medium tracking-normal text-[#f5ead5] sm:text-5xl lg:text-[4.25rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#e8dfcd]/70">
            {description}
          </p>
          {meta ? (
            <p className="mt-7 text-[10px] font-semibold tracking-[0.22em] text-[#f6d29b]/74 uppercase">
              {meta}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
