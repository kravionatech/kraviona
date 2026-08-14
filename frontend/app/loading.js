export default function RouteLoading() {
  return (
    <div
      className="min-h-[70vh] bg-[#F5F7F8] px-4 pb-24 pt-28 sm:px-6 lg:px-8"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="max-w-3xl space-y-5">
          <div className="h-3 w-28 rounded-full bg-[#E8622A]/25" />
          <div className="h-12 w-full rounded-xl bg-[#1A2E33]/10 sm:h-16" />
          <div className="h-5 w-4/5 rounded-lg bg-[#2A4A52]/10" />
          <div className="h-5 w-2/3 rounded-lg bg-[#2A4A52]/10" />
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              <div className="aspect-[16/9] bg-[#1A2E33]/8" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-1/3 rounded bg-[#E8622A]/15" />
                <div className="h-6 w-5/6 rounded bg-[#1A2E33]/10" />
                <div className="h-4 w-full rounded bg-[#2A4A52]/8" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading Kraviona page…</span>
    </div>
  );
}
