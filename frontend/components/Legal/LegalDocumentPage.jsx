import Link from "next/link";

export default function LegalDocumentPage({
  title,
  hindiTitle,
  eyebrow,
  description,
  canonical,
  sections,
  structuredData,
  relatedHref,
  relatedLabel,
}) {
  return (
    <main className="min-h-screen bg-[#071314] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-[#d96c4e]/12 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#295c5e]/25 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[#8ba5a6]">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#f4be78] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[#f4be78]" aria-current="page">
                {title}
              </li>
            </ol>
          </nav>

          <div className="max-w-4xl">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.28em] text-[#f4be78]">
              {eyebrow}
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {title}
              <span className="block pt-3 text-2xl text-[#d96c4e] sm:text-3xl">
                {hindiTitle}
              </span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#b8c8c9] md:text-lg">
              {description}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#english"
              className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-white hover:border-[#f4be78]/50 hover:text-[#f4be78] transition-colors"
            >
              English
            </a>
            <a
              href="#hindi"
              className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-white hover:border-[#f4be78]/50 hover:text-[#f4be78] transition-colors"
            >
              Hindi
            </a>
            <a
              href="#contents"
              className="rounded-full border border-[#d96c4e]/35 bg-[#d96c4e]/12 px-4 py-2 text-sm font-semibold text-[#f4be78] hover:bg-[#d96c4e]/20 transition-colors"
            >
              Contents
            </a>
          </div>

          <dl className="mt-10 grid gap-4 text-sm sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <dt className="text-[#7ea0a1]">Effective Date</dt>
              <dd className="mt-1 font-bold text-white">June 1, 2025</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <dt className="text-[#7ea0a1]">Last Updated</dt>
              <dd className="mt-1 font-bold text-white">June 1, 2025</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <dt className="text-[#7ea0a1]">Canonical</dt>
              <dd className="mt-1 break-all font-bold text-white">
                {canonical}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0f2425]" id="contents">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.24em] text-[#d96c4e]">
              Internal Navigation
            </p>
            <ol className="space-y-2 text-sm text-[#b8c8c9]">
              {sections.map((section, idx) => (
                <li key={`${section.id}-${idx}`}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-xl px-3 py-2 hover:bg-white/[0.06] hover:text-white transition-colors"
                  >
                    {idx + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <article className="space-y-6">
            <div id="english" className="sr-only">
              English legal content starts here.
            </div>
            <div id="hindi" className="sr-only">
              Hindi legal content is included with each section.
            </div>
            {sections.map((section, idx) => (
              <section
                key={`${section.id}-${idx}`}
                id={section.id}
                className="scroll-mt-28 rounded-2xl border border-white/10 bg-[#071314]/70 p-6 shadow-2xl shadow-black/10 md:p-8"
              >
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#d96c4e]">
                  Section {idx + 1}
                </p>
                <h2 className="text-2xl font-black text-[#f4be78] md:text-3xl">
                  {section.title}
                </h2>
                {section.hindiTitle && (
                  <p className="mt-2 text-lg font-semibold text-white/80">
                    {section.hindiTitle}
                  </p>
                )}
                <div className="mt-5 space-y-4 text-[15px] leading-7 text-[#cbd6d7]">
                  {section.body.map((paragraph, paragraphIdx) => (
                    <p key={`${section.id}-p-${paragraphIdx}`}>{paragraph}</p>
                  ))}
                </div>
                {section.items?.length > 0 && (
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {section.items.map((item, itemIdx) => (
                      <li
                        key={`${item.label}-${itemIdx}`}
                        className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
                      >
                        <h3 className="font-bold text-white">{item.label}</h3>
                        <p className="mt-1 text-sm leading-6 text-[#9fb4b5]">
                          {item.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section className="rounded-2xl border border-[#d96c4e]/30 bg-[#d96c4e]/10 p-6 md:p-8">
              <h2 className="text-2xl font-black text-white">Need Help?</h2>
              <p className="mt-3 text-[#f2d7c2]">
                For questions about this document, contact Kraviona at{" "}
                <a
                  className="font-bold text-white underline-offset-4 hover:underline"
                  href="mailto:contact@kraviona.com"
                >
                  contact@kraviona.com
                </a>{" "}
                or visit the contact page.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-full bg-[#d96c4e] px-5 py-3 text-sm font-bold text-white hover:bg-[#c25e41] transition-colors"
                >
                  Contact Kraviona
                </Link>
                <Link
                  href={relatedHref}
                  className="rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white hover:border-[#f4be78] hover:text-[#f4be78] transition-colors"
                >
                  {relatedLabel}
                </Link>
                <Link
                  href="/pdf/PRIVACY_POLICY_KRAVIONA.pdf"
                  target="_blank"
                  className="rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white hover:border-[#f4be78] hover:text-[#f4be78] transition-colors"
                >
                  Download PDF
                </Link>
              </div>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}
