"use client";

import { signInAction } from "@/app/(auth)/actions";
import PageShell from "@/app/_components/page-shell";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { Button } from "@/app/_components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signInAction({ email, password });

      if (result.status === "success") {
        router.push(result.redirectTo);
        router.refresh();
        return;
      }

      setError(result.error.message);
    });
  }

  return (
    <PageShell centered width="narrow">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Sign in to your account
          </h1>
          <p className="text-base text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-medium text-foreground">
              Sign up
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
                className="h-12 px-4 text-base md:text-base"
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
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 px-4 text-base md:text-base"
                placeholder="*********"
              />
            </Field>

            {error ? (
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>Sign-in failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
          </FieldGroup>

          <Button
            type="submit"
            disabled={isPending}
            className="h-12 w-full text-base md:text-base"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-base text-muted-foreground">
            Forgot your password?{" "}
            <Link
              href="/error?message=Password%20reset%20is%20not%20available%20yet."
              className="font-medium text-foreground"
            >
              Reset password
            </Link>
          </p>
        </form>
      </div>
    </PageShell>
  );
}
