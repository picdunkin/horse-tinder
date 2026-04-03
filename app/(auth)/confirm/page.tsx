import Link from "next/link";

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-100 to-red-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-6 p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Confirm your email
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Check your inbox and open the confirmation link to finish creating
          your account.
        </p>
        <Link
          href="/sign-in"
          className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-pink-500 to-red-500 px-4 py-2 text-sm font-medium text-white"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
