import * as React from "react";

import { cn } from "@/utils/cn";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border-2 border-ashgray-100 bg-ashgray-100 px-3 py-2 text-sm font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ashgray-600  focus-visible:border-ashgray-100 focus-visible:bg-ashgray-100/70 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          // dark
          "dark:border-ashgray-900 dark:bg-ashgray-900 dark:text-ashgray-100 dark:placeholder-ashgray-700",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
