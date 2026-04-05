import * as React from "react";

import { cn } from "@/app/lib/utils";

interface PageHeaderProps extends React.ComponentProps<"div"> {
  title: string;
  description?: string;
  align?: "left" | "center";
  actions?: React.ReactNode;
}

export default function PageHeader({
  className,
  title,
  description,
  align = "left",
  actions,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" &&
          "items-center text-center sm:flex-col sm:items-center",
        className,
      )}
      {...props}
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
