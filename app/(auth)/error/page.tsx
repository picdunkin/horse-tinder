import Link from "next/link";
import ErrorState from "@/app/_components/error-state";
import PageShell from "@/app/_components/page-shell";
import { Button } from "@/app/_components/ui/button";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <PageShell centered width="narrow">
      <ErrorState
        title="Authentication error"
        message={
          message ?? "Something went wrong while processing your request."
        }
        action={
          <Button asChild type="button">
            <Link href="/sign-in">Back to sign in</Link>
          </Button>
        }
      />
    </PageShell>
  );
}
