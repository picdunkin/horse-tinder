"use client";

import ErrorState from "@/app/_components/error-state";
import PageShell from "@/app/_components/page-shell";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <PageShell centered width="narrow">
          <ErrorState
            message={
              error.message || "An unexpected error interrupted the request."
            }
            onRetry={reset}
          />
        </PageShell>
      </body>
    </html>
  );
}
