import { cn } from "@/utils/cn";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-ashgray-300 dark:bg-ashgray-900",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
