import Link from "next/link";
import { type ReactNode } from "react";
import NavIsland from "./nav-island";

function Header() {
  return (
    <header className="sticky top-1.5 z-50 mx-auto h-14 w-fit rounded-md bg-black md:top-3">
      <div className="container flex h-14 w-fit items-center justify-center rounded-md">
        <Link href="/" className="text-ashgray-100 shadow-xl">
          <span className="text-2xl font-bold tracking-tighter sm:text-3xl">
            MEMORIES
          </span>
        </Link>
      </div>
    </header>
  );
}

interface LayoutPros {
  children: ReactNode;
}

// #0b0b0b
// #f0f0f0
export default function Layout({ children }: LayoutPros) {
  return (
    <div className="relative flex min-h-screen flex-col bg-ashgray-100 dark:bg-[#0b0b0b]">
      <Header />
      <main className="relative h-[100svh] w-full flex-1">{children}</main>

      {/* dynamic island nav */}
      <NavIsland />
    </div>
  );
}
