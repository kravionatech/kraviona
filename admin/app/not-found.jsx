import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-orange-500">404</h1>

        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Page Not Found
        </h2>

        <p className="mt-2 text-gray-500">
          Sorry, the page you are looking for does not exist.
        </p>

        <Link
          href="/dashboard"
          className="inline-block mt-6 rounded-lg bg-[#235056] px-6 py-3 text-white hover:bg-[#1c4449]"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
