import { Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import TrotterLogo from "@/app/_components/trotter-logo";
import { Button } from "@/app/_components/ui/button";

const heroCopy = {
  eyebrow: ["SWIPE RIGHT.", "SADDLE UP."],
  description:
    "Match with local singles in your pasture. Whether you're looking for a quick trot or a lifelong pasture mate.",
  cta: {
    href: "/sign-up",
    label: "Create account",
  },
};

const featuredProfile = {
  name: "Spirit",
  age: 19,
  distance: "12 miles away",
  image:
    "https://acuuehefzzdzzmttlsly.supabase.co/storage/v1/object/public/static/uni.png",
};

const successStory = {
  quote:
    "I swiped right because I loved his mane, but we stayed together because we both love eating apples at 3 AM. Trotter made it happen.",
  couple: "Bojack & Secretariat",
  image:
    "https://acuuehefzzdzzmttlsly.supabase.co/storage/v1/object/public/static/hc4.png",
};

const footerLinks = [
  { href: "/sign-up", label: "Create account" },
  { href: "/sign-in", label: "Sign in" },
  { href: "/matches/list", label: "Browse matches" },
];

type SwipeActionButtonProps = {
  ariaLabel: string;
  className: string;
  children: React.ReactNode;
};

function SwipeActionButton({
  ariaLabel,
  className,
  children,
}: SwipeActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`flex items-center justify-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${className}`}
    >
      {children}
    </button>
  );
}

function SwipeCard() {
  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[360px] rotate-3 transition-transform duration-500 hover:rotate-0">
      <div className="absolute inset-0 z-0 scale-95 -rotate-6 rounded-3xl border border-current bg-background opacity-50 shadow-xl" />

      <div className="group absolute inset-0 z-10 flex flex-col overflow-hidden rounded-3xl border border-current bg-background shadow-xl">
        <div className="relative h-[80%] w-full">
          <Image
            src={featuredProfile.image}
            alt={`${featuredProfile.name}, ${featuredProfile.age}`}
            fill
            priority
            sizes="(max-width: 768px) 85vw, 360px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="mb-1 text-3xl font-black text-white">
              {featuredProfile.name}, {featuredProfile.age}
            </h2>
            <p className="font-medium text-white/80">
              {featuredProfile.distance}
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center gap-6 bg-background">
          <SwipeActionButton
            ariaLabel="Dismiss profile"
            className="size-14 border-primary text-primary hover:bg-primary hover:text-white"
          >
            <X strokeWidth={3} className="size-8" aria-hidden="true" />
          </SwipeActionButton>
          <SwipeActionButton
            ariaLabel="Like profile"
            className="size-16 border-[#17E2A5] text-[#17E2A5] hover:bg-[#17E2A5] hover:text-white focus-visible:ring-[#17E2A5]/25"
          >
            <Heart fill="currentColor" className="size-8" aria-hidden="true" />
          </SwipeActionButton>
        </div>

        <div
          aria-hidden="true"
          className="absolute top-8 right-8 rounded-md border-4 border-[#17E2A5] bg-background/10 px-4 py-1 text-2xl font-black tracking-widest text-[#17E2A5] uppercase opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100"
        >
          LIKE
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-visible bg-background text-foreground">
      <main className="relative isolate flex min-h-[100svh] items-center px-6 pt-16 pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-16 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-primary/45 to-[#FF655B]/25 blur-[140px]" />
          <div className="absolute top-24 right-[-5rem] h-80 w-80 rounded-full bg-gradient-to-tr from-[#FF655B]/35 to-primary/25 blur-[150px]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="z-10 space-y-8 text-center lg:text-left">
            <h1 className="bg-gradient-to-r from-primary to-[#FF655B] bg-clip-text text-6xl font-black italic leading-[0.9] tracking-tighter text-transparent md:text-8xl">
              {heroCopy.eyebrow[0]}
              <br />
              {heroCopy.eyebrow[1]}
            </h1>
            <p className="mx-auto max-w-md pr-4 text-xl font-medium text-muted-foreground md:text-2xl lg:mx-0">
              {heroCopy.description}
            </p>
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full bg-gradient-to-r from-primary to-[#FF655B] px-10 text-xl font-bold shadow-xl transition-all hover:scale-105 hover:shadow-[0_8px_25px_rgba(253,41,123,0.5)] dark:text-foreground"
            >
              <Link href={heroCopy.cta.href}>{heroCopy.cta.label}</Link>
            </Button>
          </div>

          <SwipeCard />
        </div>
      </main>

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-8rem] left-1/2 z-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-t from-primary/35 to-[#FF655B]/20 blur-[170px]"
        />
        <h2 className="mb-16 text-center text-4xl font-black italic md:text-5xl">
          SUCCESS STORIES
        </h2>

        <div className="relative flex flex-col items-center gap-12 overflow-hidden rounded-[3rem] border bg-background p-8 shadow-xl md:flex-row md:p-16">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 z-0 text-[200px] leading-none font-black italic text-gray-50"
          >
            &quot;
          </div>
          <div className="relative z-10 h-48 w-48 overflow-hidden rounded-full border shadow-lg md:h-64 md:w-64">
            <Image
              src={successStory.image}
              alt={successStory.couple}
              fill
              sizes="(max-width: 768px) 12rem, 16rem"
              className="object-cover"
            />
          </div>
          <div className="relative z-10 flex-1 space-y-6 text-center md:text-left">
            <p className="text-2xl font-bold leading-tight text-sidebar-primary md:text-3xl">
              &quot;{successStory.quote}&quot;
            </p>
            <p className="text-xl font-bold text-muted-foreground">
              {successStory.couple}
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-card px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <TrotterLogo className="text-2xl" textClassName="text-2xl" />
          <nav
            aria-label="Footer"
            className="flex flex-wrap justify-center gap-8"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-bold text-gray-500 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="text-sm font-medium text-gray-400">
            © 2026 Trotter Group
          </div>
        </div>
      </footer>
    </div>
  );
}
