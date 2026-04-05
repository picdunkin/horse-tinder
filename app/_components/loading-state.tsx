import { LoaderCircle } from "lucide-react";

import { cn } from "@/app/lib/utils";
import { Card, CardContent } from "@/app/_components/ui/card";

interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function LoadingState({
  title = "Loading",
  description,
  className,
}: LoadingStateProps) {
  return (
    <Card className={cn("mx-auto w-full max-w-md", className)}>
      <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LoaderCircle className="size-7 animate-spin" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-foreground">{title}</p>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
