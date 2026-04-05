"use client";

import { confirmEmailAction } from "@/app/(auth)/actions";
import LoadingState from "@/app/_components/loading-state";
import PageShell from "@/app/_components/page-shell";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function AuthCallbackPendingState() {
  return (
    <PageShell centered width="narrow">
      <LoadingState
        title="Confirming your email"
        description="We are verifying your confirmation link and signing you in."
      />
    </PageShell>
  );
}

function AuthCallbackContent() {
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

  return <AuthCallbackPendingState />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackPendingState />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
