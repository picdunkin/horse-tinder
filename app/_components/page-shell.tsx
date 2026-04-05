import * as React from "react";

import { cn } from "@/app/lib/utils";

interface PageShellProps extends React.ComponentProps<"div"> {
  centered?: boolean;
  width?: "default" | "narrow" | "wide" | "full";
}

const widthClasses = {
  default: "max-w-5xl",
  narrow: "max-w-2xl",
  wide: "max-w-6xl",
  full: "max-w-none",
};

export default function PageShell({
  className,
  children,
  centered = false,
  width = "default",
  ...props
}: PageShellProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col bg-background text-foreground",
        centered && "items-center justify-center",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "mx-auto items-center flex w-full flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8",
          widthClasses[width],
          centered && "justify-center",
        )}
      >
        {children}
      </div>
    </div>
  );
}
