"use client";

import { getCurrentSessionAction, signOutAction } from "@/app/(auth)/actions";
import { cn } from "@/app/lib/utils";
import { Button, buttonVariants } from "@/app/_components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import TrotterLogo from "./trotter-logo";

export default function Navbar() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const logoUrl = userId ? "/discover" : "/";

  useEffect(() => {
    async function loadSession() {
      const result = await getCurrentSessionAction();
      if (result.status === "success") {
        setUserId(result.session?.userId ?? null);
      }
    }

    loadSession();
  }, [pathname]);

  function handleSignOut() {
    startTransition(async () => {
      const result = await signOutAction();
      if (result.status === "success") {
        setUserId(null);
        router.push(result.redirectTo);
        router.refresh();
      }
    });
  }

  const navLinks = [
    { href: "/discover", label: "Discover" },
    { href: "/matches/list", label: "Chat" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <TrotterLogo href={logoUrl} />

        {userId ? (
          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    isActive && "bg-muted text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        ) : null}

        {userId ? (
          <Button
            onClick={handleSignOut}
            disabled={isPending}
            variant="outline"
            size="sm"
            type="button"
          >
            <LogOut />
            {isPending ? "Signing Out..." : "Sign Out"}
          </Button>
        ) : (
          <Button asChild size="sm">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
