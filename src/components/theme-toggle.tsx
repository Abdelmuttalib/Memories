import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import type { ClassValue } from "clsx";

import { cn } from "@/utils/cn";

export function ThemeToggle({ className }: { className?: ClassValue }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      // variant="secondary"
      // size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(className)}
    >
      <SunIcon className="rotate-0 scale-100 transition-all dark:hidden dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="hidden rotate-90 scale-0 transition-all dark:block dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
