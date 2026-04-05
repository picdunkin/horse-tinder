"use client";

import { signUpAction } from "@/app/(auth)/actions";
import PageShell from "@/app/_components/page-shell";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { Button } from "@/app/_components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { horseHead } from "@lucide/lab";
import { Icon, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signUpAction({ email, password });

      if (result.status === "success") {
        router.push(result.redirectTo);
        return;
      }

      setError(result.error.message);
    });
  }

  return (
    <PageShell centered width="narrow">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Icon iconNode={horseHead} className="size-5" />
          </div>
          <span className="text-2xl font-semibold">Horse Tinder</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="text-base text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-foreground">
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email" className="text-base font-medium">
                Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="stallion@stable.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 rounded-xl px-4 text-base md:text-base"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password" className="text-base font-medium">
                Password
              </FieldLabel>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 rounded-xl px-4 text-base md:text-base"
              />
            </Field>

            {error ? (
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>Sign-up failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
          </FieldGroup>

          <Button
            type="submit"
            disabled={isPending}
            className="h-12 w-full rounded-xl text-base md:text-base"
          >
            {isPending ? "Creating account..." : "Sign up"}
          </Button>
        </form>
      </div>
    </PageShell>
  );
}
