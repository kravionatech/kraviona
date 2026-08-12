"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.getElementById("article-content");
      if (!article) return;

      const start = article.offsetTop;
      const scrollableHeight = Math.max(article.offsetHeight - window.innerHeight, 1);
      const nextProgress = ((window.scrollY - start) / scrollableHeight) * 100;
      setProgress(Math.min(100, Math.max(0, nextProgress)));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[100] h-[3px] bg-transparent"
    >
      <div
        className="h-full bg-[#E8622A] transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
