import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import Link, { LinkProps } from "next/link";
import { ClassValue } from "clsx";

// className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"

{
  /* <button
type="button"
className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
onClick={closeModal}
>
Got it, thanks!
</button> */
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-90 disabled:pointer-events-none ring-offset-background",
  {
    // hover black // #2c343e
    variants: {
      variant: {
        default:
          "bg-black text-white hover:bg-ashgray-900/90 dark:bg-white dark:text-black dark:hover:bg-ashgray-100/90",
        outline:
          "border-2 border-ashgray-800 text-ashgray-900 hover:bg-ashgray-200/50 dark:border-2 dark:border-white dark:text-white dark:hover:bg-ashgray-900/90",
        secondary: "bg-ashgray-100 text-ashgray-900 hover:bg-ashgray-200",
        ghost: "hover:bg-ashgray-100 hover:text-ashgray-900",
        link: "underline-offset-4 hover:underline text-primary",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        "destructive-outline":
          "bg-transparent text-destructive hover:bg-destructive/10 border-2 border-destructive",
      },
      size: {
        default: "h-11 py-2 px-6",
        sm: "h-10 px-4 rounded-md",
        lg: "h-12 px-9 rounded-md",
        icon: "h-11 px-2 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {!isLoading ? (
          children
        ) : (
          <div className="inline-flex transform items-center transition-all duration-200 ease-in-out">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </div>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export interface ButtonLinkProps
  extends LinkProps,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: ClassValue;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : Link;
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

// {!isLoading ? (
//   children
// ) : (
//   <div className="inline-flex items-center">
//     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//     Loading
//   </div>
// )}
ButtonLink.displayName = "ButtonLink";

export { Button, buttonVariants, ButtonLink };
