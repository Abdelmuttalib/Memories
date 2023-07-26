/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { cn } from "@/utils/cn";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface LayoutPros {
  children: ReactNode;
}

const homeNavLinks = [
  {
    label: "Feed",
    href: "/feed",
  },
  {
    label: "Profile",
    href: "/profile",
  },
];

// #0b0b0b
// #f0f0f0
const Layout: FC<LayoutPros> = ({ children }) => {
  const { pathname } = useRouter();
  return (
    <div className="flex w-screen flex-col">
      {/* header */}
      <header className="h-24 w-full">
        <div className="container flex h-24 w-full items-center justify-between">
          <Link href="/">
            <h3 className="text-2xl font-bold tracking-tighter">MEMORIES</h3>
          </Link>
          <nav className="">
            <Tabs defaultValue={pathname} className="w-[150px] sm:w-[200px]">
              <TabsList className="w-full">
                {homeNavLinks.map(({ label, href }) => (
                  <TabsTrigger
                    key={`${label}${href}`}
                    value={href}
                    asChild
                    className="w-full"
                  >
                    <Link href={href}>{label}</Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            {/* <ul className="flex">
              {homeNavLinks.map(({ label, href }) => (
                <li key={`${label}${href}`}>
                  <Link
                    href={href}
                    className={cn(
                      "rounded px-3 py-1.5 font-medium hover:bg-primary/5",
                      {
                        "underline decoration-2 underline-offset-4":
                          pathname === href,
                      }
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul> */}
          </nav>
          <div className="hidden items-center gap-1.5 sm:flex">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      {/* main */}
      <main className="h-[100svh] w-full flex-1">{children}</main>
      {/* footer */}
      <footer></footer>
    </div>
  );
};

export default Layout;
