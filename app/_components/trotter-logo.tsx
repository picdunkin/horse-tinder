import { Flame } from "lucide-react";
import Link from "next/link";

import { cn } from "@/app/lib/utils";

interface TrotterLogoProps {
  href?: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export default function TrotterLogo({
  href = "/",
  className,
  iconClassName,
  textClassName,
}: TrotterLogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 font-black tracking-tighter text-primary transition-opacity hover:opacity-90",
        className,
      )}
    >
      <Flame
        fill="currentColor"
        className={cn("size-6", iconClassName)}
        aria-hidden="true"
      />
      <span className={cn("text-xl", textClassName)}>Trotter</span>
    </Link>
  );
}
