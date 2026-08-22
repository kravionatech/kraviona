import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { API_URL } from "@/utils/api";

export const revalidate = 3600;

async function getProject(slug) {
  try {
    const response = await fetch(
      `${API_URL}/projects/${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.data || null;
  } catch {
    return null;
  }
}

export default async function ProjectDetailsPage({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const projectImage =
    project.image || "/images/office/case-study-product.webp";

  return (
    <main className="bg-[#f5f7f8] py-20">
      <article className="mx-auto max-w-5xl px-4 sm:px-6">
        <Link href="/case-studies" className="text-sm font-bold text-[#e8622a]">
          ← All case studies
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl bg-[#1a2e33] shadow-xl">
          <div className="relative h-80 w-full">
            <Image
              src={projectImage}
              alt={project.imageAlt || project.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover opacity-70"
            />
          </div>
          <div className="p-8 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f28c5e]">
              {project.category}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-white">
              {project.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-200">
              {project.description}
            </p>
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block rounded-lg bg-[#e8622a] px-5 py-3 text-sm font-bold text-white"
              >
                Visit project
              </a>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            ["Overview", project.overview],
            ["Challenge", project.challenge],
            ["Solution", project.solution],
          ]
            .filter(([, value]) => value)
            .map(([title, value]) => (
              <section
                key={title}
                className="rounded-2xl bg-white p-7 shadow-sm"
              >
                <h2 className="text-xl font-extrabold text-[#1a2e33]">
                  {title}
                </h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600">
                  {value}
                </p>
              </section>
            ))}

          <section className="rounded-2xl bg-white p-7 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#1a2e33]">
              Technology
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(project.techStack || []).length ? (
                project.techStack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-[#1a2e33]/10 px-3 py-1.5 text-sm font-semibold text-[#1a2e33]"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <p className="text-slate-500">No data found.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-7 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#1a2e33]">Results</h2>
            {(project.results || []).length ? (
              <ul className="mt-4 space-y-3">
                {project.results.map((item) => (
                  <li key={item} className="text-slate-600">
                    ✓ {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-slate-500">No data found.</p>
            )}
          </section>
        </div>
      </article>
    </main>
  );
}
