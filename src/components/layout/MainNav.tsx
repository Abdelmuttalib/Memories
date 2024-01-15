import { USER_SESSION_STATUS } from "@/utils/user-session-status";
import ImageUpload from "../feed/ImageUpload";
import { ButtonLink } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import type { FC, ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { HomeIcon, PlusIcon, UserIcon } from "@heroicons/react/20/solid";
import { LogIn, LogOut, Plus, PlusCircle, User } from "lucide-react";
import { useRouter } from "next/router";
import { Menu, Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import type { ClassValue } from "clsx";
import { cn } from "@/utils/cn";
import { MoonIcon, SunIcon } from "lucide-react";

import { Avatar, AvatarImage } from "../ui/avatar";
import { api } from "@/utils/api";
import { Skeleton } from "../ui/skeleton";
import { ThemeToggle } from "../theme-toggle";

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

interface MainNavProps {
  className?: ClassValue;
}

export default function MainNav({ className }: MainNavProps) {
  const { pathname } = useRouter();
  const { status } = useSession();
  return (
    <div
      className={cn(
        "sticky bottom-6 left-0 right-0 z-40 mx-auto flex w-full max-w-sm items-center justify-between gap-x-3 rounded-2xl border-2 border-black bg-ashgray-200 p-3 px-5 shadow-xl dark:border-ashgray-200 dark:bg-ashgray-900",
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
      {/* <div className="flex items-center gap-x-3"> */}
      <ImageUpload />

      <ThemeToggle />

      {status === USER_SESSION_STATUS.AUTHENTICATED && <UserMenu />}
      {status === USER_SESSION_STATUS.UNAUTHENTICATED && (
        <ButtonLink
          href="/sign-in"
          variant="outline"
          size="sm"
          className="flex items-center gap-x-1.5"
        >
          Sign In
          <LogIn className="w-5" />
        </ButtonLink>
      )}
      {/* </div> */}
    </div>
  );
}

function UserMenu() {
  const { push } = useRouter();

  const { data: userProfileData, isLoading: isLoadingUserProfileData } =
    api.user.getUserProfileData.useQuery();
  return (
    <Menu as="div" className="relative inline-block">
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute bottom-full mb-4 w-fit min-w-[8rem] origin-top-right divide-y divide-ashgray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-ashgray-800 dark:bg-ashgray-900 sm:w-48">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={() => push("/profile")}
                  className={`${
                    active
                      ? "bg-ashgray-900 text-white dark:bg-white dark:text-black"
                      : "text-ashgray-900 dark:text-ashgray-100"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium`}
                >
                  <User className="mr-2 h-5 w-5" aria-hidden="true" />
                  Profile
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={() => signOut()}
                  className={`${
                    active
                      ? "bg-ashgray-900 text-white dark:bg-white dark:text-black"
                      : "text-ashgray-900 dark:text-ashgray-100"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium`}
                >
                  <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>

      <div className="-mb-1">
        <Menu.Button>
          <Avatar className="relative mx-1 ring-2 ring-black ring-offset-2 dark:ring-white dark:ring-offset-ashgray-900">
            {isLoadingUserProfileData && !userProfileData && (
              <Skeleton className="h-full w-full rounded-full" />
            )}
            {userProfileData && !isLoadingUserProfileData && (
              <AvatarImage
                src={
                  userProfileData?.image ||
                  "https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg"
                  // "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=1600"
                }
                alt="profile avatar"
                className="object-cover"
              ></AvatarImage>
            )}
          </Avatar>
          {/* Options
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            /> */}
        </Menu.Button>
      </div>
    </Menu>
  );
}
