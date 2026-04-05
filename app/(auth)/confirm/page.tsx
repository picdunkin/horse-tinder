import Link from "next/link";
import { MailCheck } from "lucide-react";

import EmptyState from "@/app/_components/empty-state";
import PageShell from "@/app/_components/page-shell";
import { Button } from "@/app/_components/ui/button";

export default function ConfirmEmailPage() {
  return (
    <PageShell centered width="narrow">
      <EmptyState
        icon={<MailCheck className="size-8" />}
        title="Confirm your email"
        description="Check your inbox and open the confirmation link to finish creating your account."
        action={
          <Button asChild>
            <Link href="/sign-in">Back to sign in</Link>
          </Button>
        }
      />
    </PageShell>
  );
}
