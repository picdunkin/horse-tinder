"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-100 to-red-100 px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Something went wrong
          </h1>
          <p className="text-gray-600">
            {error.message || "An unexpected error interrupted the request."}
          </p>
          <button
            onClick={reset}
            className="rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
