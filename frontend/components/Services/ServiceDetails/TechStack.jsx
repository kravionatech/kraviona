import React from "react";

const techStackData = [
  {
    name: "React.js",
    color: "text-[#61DAFB]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8 md:w-10 md:h-10"
      >
        <path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12S6.07 1.25 12 1.25 22.75 6.07 22.75 12 17.93 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25 21.25 17.1 21.25 12 17.1 2.75 12 2.75z" />
        <path d="M12 16a4 4 0 110-8 4 4 0 010 8zm0-6.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM19.14 8.52a.75.75 0 01-.39-1 9.94 9.94 0 000-9.04.75.75 0 111.3-.75 11.44 11.44 0 010 10.4.75.75 0 01-.91.39zM4.86 15.48a.75.75 0 01.39 1 9.94 9.94 0 000 9.04.75.75 0 11-1.3.75 11.44 11.44 0 010-10.4.75.75 0 01.91-.39z" />
      </svg>
    ),
  },
  {
    name: "Next.js",
    color: "text-black",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8 md:w-10 md:h-10"
      >
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-2.02-8.583l4.636 6.368A7.96 7.96 0 0019.06 13.5l-4.743-6.505a.75.75 0 00-1.217.882l3.87 5.308a6.5 6.5 0 01-9.97-5.542V7.5a.75.75 0 00-1.5 0v6a8 8 0 008 8 .75.75 0 00.48-.174z" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    color: "text-[#339933]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8 md:w-10 md:h-10"
      >
        <path d="M11.96 1.886a1.18 1.18 0 00-1.127.006L2.43 6.666A1.173 1.173 0 001.83 7.68v8.636c0 .427.23.816.596 1.026l8.4 4.773a1.185 1.185 0 001.144-.006l8.403-4.767a1.17 1.17 0 00.596-1.026V7.68c0-.424-.225-.81-.588-1.023l-8.42-4.77zM11.5 3.3l7.5 4.25-3.5 2-4-2.25V5.3zm-1 0v2L6.5 7.55l-4-2.25L10.5 3.3zM2 9.2l4 2.25v4.5L2 13.7V9.2zm19 0v4.5l-4 2.25v-4.5l4-2.25zm-9.5 9.5v-2l4-2.25 3.5 2-7.5 4.25zm-1 0l-7.5-4.25 3.5-2 4 2.25v2z" />
      </svg>
    ),
  },
  {
    name: "MongoDB",
    color: "text-[#47A248]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8 md:w-10 md:h-10"
      >
        <path d="M11.9 1c-1.3 2.9-3.2 5.6-4.5 9-1 2.5-1 6.2.2 8.7 1.2 2.6 3.6 4.1 4.3 4.3.7-.2 3.1-1.7 4.3-4.3 1.2-2.5 1.2-6.2.2-8.7-1.3-3.4-3.2-6.1-4.5-9zm0 2.2c1.2 3.1 2.8 5.6 3.9 8.3-2.1-.8-4.9-1.2-7.8-1.5 1-2.7 2.7-5.2 3.9-6.8z" />
      </svg>
    ),
  },
  {
    name: "Tailwind",
    color: "text-[#06B6D4]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8 md:w-10 md:h-10"
      >
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zM6.001 12c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    ),
  },
];

export default function TechStack() {
  return (
    <section className="relative z-20 -mt-16 mx-4 sm:mx-8 lg:mx-auto max-w-5xl">
      <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-8 md:p-10">
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
          Powered By Industry-Leading Tech
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {techStackData.map((tech, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div
                className={`${tech.color} opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 drop-shadow-sm`}
              >
                {tech.icon}
              </div>
              <span className="text-sm font-semibold text-gray-400 group-hover:text-[#1b3d3e] transition-colors opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
