"use client";

import * as React from "react";

import { getCurrentSessionAction, signOutAction } from "@/app/(auth)/actions";
import { cn } from "@/app/lib/utils";
import TrotterLogo from "@/app/_components/trotter-logo";
import { Button, buttonVariants } from "@/app/_components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import {
  Compass,
  LogOut,
  Menu,
  MessageCircle,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<React.ComponentProps<"svg">>;
};

const navLinks: NavLink[] = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/matches/list", label: "Chat", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function useNavbarRuntimeState() {
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      const result = await getCurrentSessionAction();

      if (!isMounted) {
        return;
      }

      if (result.status === "success") {
        setUserId(result.session?.userId ?? null);
        return;
      }

      setUserId(null);
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  function handleSignOut() {
    startTransition(async () => {
      const result = await signOutAction();

      if (result.status !== "success") {
        return;
      }

      setUserId(null);
      router.push(result.redirectTo);
      router.refresh();
    });
  }

  return {
    pathname,
    userId,
    logoUrl: userId ? "/discover" : "/",
    isPending,
    onSignOut: handleSignOut,
  };
}

function DesktopLinks({
  pathname,
  userId,
  className,
  activeClassName,
  linkClassName,
}: {
  pathname: string;
  userId: string | null;
  className?: string;
  activeClassName?: string;
  linkClassName?: string;
}) {
  if (!userId) {
    return null;
  }

  return (
    <div className={cn("hidden items-center md:flex", className)}>
      {navLinks.map((link) => {
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-muted-foreground",
              linkClassName,
              isActivePath(pathname, link.href) && activeClassName,
            )}
          >
            <Icon className="size-4" />
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

function DesktopAuth({
  userId,
  isPending,
  onSignOut,
  className,
  signOutClassName,
}: {
  userId: string | null;
  isPending: boolean;
  onSignOut: () => void;
  className?: string;
  signOutClassName?: string;
}) {
  if (userId) {
    return (
      <div className="hidden md:block">
        <Button
          onClick={onSignOut}
          disabled={isPending}
          variant="outline"
          size="sm"
          type="button"
          className={className}
        >
          <LogOut />
          <span className={signOutClassName}>
            {isPending ? "Signing Out..." : "Sign Out"}
          </span>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("hidden items-center gap-2 md:flex", className)}>
      <Button asChild variant="ghost" size="sm">
        <Link href="/sign-in">Sign In</Link>
      </Button>
    </div>
  );
}

function MobileSignedOutActions() {
  return (
    <div className="flex items-center gap-2 md:hidden">
      <Button asChild variant="ghost" size="sm">
        <Link href="/sign-in">Sign In</Link>
      </Button>
    </div>
  );
}

function MobileMenu({
  pathname,
  userId,
  isPending,
  onSignOut,
  triggerClassName,
  panelClassName,
  listClassName,
}: {
  pathname: string;
  userId: string | null;
  isPending: boolean;
  onSignOut: () => void;
  triggerClassName?: string;
  panelClassName?: string;
  listClassName?: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className={cn("md:hidden", triggerClassName)}
          aria-label="Open navigation menu"
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className={cn("w-[22rem] gap-0 border-l bg-background p-0", panelClassName)}
      >
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="text-lg font-black tracking-tight">
            Saddle Up
          </SheetTitle>
          <SheetDescription>
            Jump between discovery, chats, and your profile.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col justify-between gap-8 px-5 py-5">
          <div className={cn("flex flex-col gap-2", listClassName)}>
            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <SheetClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold text-foreground transition-colors",
                      isActivePath(pathname, link.href)
                        ? "border-primary/35 bg-primary/12"
                        : "border-border bg-card hover:bg-muted",
                    )}
                  >
                    <Icon className="size-4" />
                    {link.label}
                  </Link>
                </SheetClose>
              );
            })}
          </div>

          {userId ? (
            <Button
              onClick={onSignOut}
              disabled={isPending}
              variant="outline"
              className="w-full justify-center border-border bg-card text-foreground hover:bg-muted"
              type="button"
            >
              <LogOut />
              {isPending ? "Signing Out..." : "Sign Out"}
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="w-full">
                  <Link href="/sign-up">Create Account</Link>
                </Button>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function Navbar() {
  const runtime = useNavbarRuntimeState();
  const { pathname, userId, logoUrl, isPending, onSignOut } = runtime;

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <TrotterLogo href={logoUrl} />

        <DesktopLinks
          pathname={pathname}
          userId={userId}
          className="gap-2 rounded-full border bg-muted/40 px-2 py-1"
          linkClassName="rounded-full"
          activeClassName="bg-background text-foreground shadow-sm"
        />

        <div className="flex items-center gap-2">
          <DesktopAuth
            userId={userId}
            isPending={isPending}
            onSignOut={onSignOut}
          />
          {userId ? (
            <MobileMenu
              pathname={pathname}
              userId={userId}
              isPending={isPending}
              onSignOut={onSignOut}
            />
          ) : (
            <MobileSignedOutActions />
          )}
        </div>
      </div>
    </nav>
  );
}
