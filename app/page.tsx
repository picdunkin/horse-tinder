import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-6 px-8 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          Horse Tinder
        </h1>
        <p className="max-w-xl text-lg text-gray-600 dark:text-gray-400">
          Discover matches, keep chats match-gated, and manage your stable-ready
          profile.
        </p>
        <div className="flex gap-4">
          <Link
            href="/sign-in"
            className="rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 font-semibold text-white"
          >
            Sign In
          </Link>
          <Link
            href="/discover"
            className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-900 dark:text-white"
          >
            Explore
          </Link>
        </div>
      </main>
    </div>
  );
}
