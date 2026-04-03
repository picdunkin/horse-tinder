"use client";

import { confirmEmailAction } from "@/app/(auth)/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function confirm() {
      const code = searchParams.get("code");

      if (!code) {
        router.replace("/error?message=Missing%20confirmation%20code");
        return;
      }

      const result = await confirmEmailAction({ code });

      if (result.status === "success") {
        router.replace(result.redirectTo);
        router.refresh();
        return;
      }

      const message =
        "error" in result && result.error
          ? result.error.message
          : "Confirmation failed.";
      router.replace(`/error?message=${encodeURIComponent(message)}`);
    }

    confirm();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-100 to-red-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Confirming your email...
        </p>
      </div>
    </div>
  );
}
