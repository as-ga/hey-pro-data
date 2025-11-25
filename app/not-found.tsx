import Link from "next/link";

export default function PageNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-4 text-4xl font-bold text-pink">
        404 - Page Not Found
      </h1>
      <p className="mb-8 text-lg text-gray-700">
        Oops! The page you&#39;re looking for doesn&#39;t exist.
      </p>
      <Link
        href="/"
        className="rounded bg-light-green px-4 py-2 text-white hover:bg-light-green/80"
      >
        Go Back Home
      </Link>
    </main>
  );
}
