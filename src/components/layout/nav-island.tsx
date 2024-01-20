import { cn } from "@/utils/cn";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { HomeIcon } from "@heroicons/react/20/solid";
import type { ClassValue } from "clsx";
import { USER_SESSION_STATUS } from "@/utils/user-session-status";
import ImageUpload from "../feed/ImageUpload";
import { ThemeToggle } from "../theme-toggle";
import { ButtonLink } from "../ui/button";
import UserMenu from "../user-menu";
import { LogIn } from "lucide-react";

const homeNavLinks = [
  {
    label: "Feed",
    href: "/feed",
    icon: <HomeIcon className="h-6 w-6" />,
  },
  // {
  //   label: "Profile",
  //   href: "/profile",
  //   icon: <User className="h-6 w-6" />,
  // },
];

interface NavIslandProps {
  className?: ClassValue;
}

export default function NavIsland({ className }: NavIslandProps) {
  const { pathname } = useRouter();
  const { status } = useSession();
  return (
    <div
      className={cn(
        "sticky bottom-6 left-0 right-0 z-40 mx-auto flex w-full items-center justify-between gap-x-3 rounded-2xl border-2 border-black bg-ashgray-200 p-3 px-4 shadow-xl dark:border-ashgray-200 dark:bg-black/[0.7] dark:backdrop-blur-lg",
        {
          "max-w-fit": status === USER_SESSION_STATUS.AUTHENTICATED,
          "max-w-xs": status === USER_SESSION_STATUS.UNAUTHENTICATED,
        },
        className
      )}
    >
      <nav>
        <Tabs defaultValue={pathname} className="rounded-xl">
          <TabsList className="h-auto rounded-xl bg-ashgray-300 dark:bg-ashgray-900">
            {homeNavLinks.map(({ label, href, icon }) => (
              <TabsTrigger
                key={`${label}${href}`}
                value={href}
                asChild
                className="dark:data-[state=active]:text-ashgray-4400 rounded-[6px] dark:bg-ashgray-900 dark:text-ashgray-200 dark:data-[state=active]:bg-ashgray-800/50 dark:data-[state=active]:text-white"
              >
                <Link href={href}>
                  {/* {label} */}
                  {icon}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </nav>
      {status === USER_SESSION_STATUS.AUTHENTICATED && <ImageUpload />}

      <div>
        <ThemeToggle />
      </div>

      {status === USER_SESSION_STATUS.AUTHENTICATED && <UserMenu />}

      {status === USER_SESSION_STATUS.UNAUTHENTICATED && (
        <ButtonLink
          href="/sign-in"
          // variant="outline"
          className="inline-flex w-full items-center gap-x-1.5"
        >
          Sign In
          <LogIn className="w-5" />
        </ButtonLink>
      )}
    </div>
  );
}
