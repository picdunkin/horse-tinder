import * as React from "react";
import { AlertCircle } from "lucide-react";

import { cn } from "@/app/lib/utils";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";

interface ErrorStateProps {
  title?: string;
  message: string;
  action?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  message,
  action,
  onRetry,
  retryLabel = "Try again",
  className,
}: ErrorStateProps) {
  return (
    <Card className={cn("mx-auto w-full max-w-md", className)}>
      <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-7" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        {action}
        {!action && onRetry ? (
          <Button onClick={onRetry} type="button">
            {retryLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
