import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7f8] px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-[#e8622a]">404</h1>

        <h2 className="mt-4 text-2xl font-semibold text-[#1a2e33]">
          Page Not Found
        </h2>

        <p className="mt-2 text-[#2a4a52]">
          Sorry, the page you are looking for does not exist.
        </p>

        <Link
          href="/dashboard"
          className="inline-block mt-6 rounded-lg bg-[#2a4a52] px-6 py-3 text-white transition hover:bg-[#3d6b77]"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
