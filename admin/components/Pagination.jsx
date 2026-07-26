"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const getPages = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  return [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
};

export default function Pagination({
  page = 1,
  totalPages = 0,
  total = 0,
  limit = 20,
  itemLabel = "items",
  onPageChange,
  className = "",
}) {
  const safeTotalPages = Math.max(Number(totalPages) || 0, 0);
  if (safeTotalPages <= 1) return null;

  const pages = getPages(page, safeTotalPages);
  const firstItem = total ? (page - 1) * limit + 1 : 0;
  const lastItem = Math.min(page * limit, total);

  return (
    <div
      className={`flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <p className="text-xs font-medium text-slate-500">
        Showing {firstItem}–{lastItem} of {total} {itemLabel}
      </p>

      <nav className="flex items-center gap-1" aria-label={`${itemLabel} pagination`}>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-[#235056]/30 hover:text-[#235056] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={14} />
          Previous
        </button>

        {pages.map((pageNumber, index) => {
          const previousPage = pages[index - 1];
          const showGap = previousPage && pageNumber - previousPage > 1;

          return (
            <span key={pageNumber} className="contents">
              {showGap ? (
                <span className="px-1 text-xs text-slate-400">…</span>
              ) : null}
              <button
                type="button"
                onClick={() => onPageChange(pageNumber)}
                aria-current={pageNumber === page ? "page" : undefined}
                className={`h-9 min-w-9 rounded-lg border px-2 text-xs font-bold transition ${
                  pageNumber === page
                    ? "border-[#235056] bg-[#235056] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#235056]/30 hover:text-[#235056]"
                }`}
              >
                {pageNumber}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= safeTotalPages}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-[#235056]/30 hover:text-[#235056] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </nav>
    </div>
  );
}
