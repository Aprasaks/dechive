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
    <section className="relative isolate overflow-hidden border-b border-[#f5ead5]/10 bg-[#050912] text-[#f3eadb]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_18%,rgba(42,168,161,0.14),transparent_34%),radial-gradient(circle_at_16%_10%,rgba(185,137,78,0.14),transparent_28%),linear-gradient(180deg,#050912_0%,#08111c_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.08] [background-image:radial-gradient(circle_at_center,rgba(127,198,192,0.85)_1px,transparent_1.5px),linear-gradient(rgba(245,234,213,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(245,234,213,0.35)_1px,transparent_1px)] [background-size:88px_88px,44px_44px,44px_44px]"
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
            <p className="mt-7 text-[10px] font-semibold tracking-[0.22em] text-[#7fc6c0]/82 uppercase">
              {meta}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
