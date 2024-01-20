import { api } from "@/utils/api";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { Skeleton } from "./ui/skeleton";
import { LogOut, User } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function UserMenu() {
  const { push } = useRouter();

  const { data: userProfileData, isLoading: isLoadingUserProfileData } =
    api.user.getUserProfileData.useQuery();

  const userMenuItems = [
    {
      label: "Profile",
      href: "/profile",
      icon: <User className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => push("/profile"),
    },
    {
      label: "Sign out",
      href: "/sign-out",
      icon: <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => signOut(),
    },
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute bottom-full -ml-16 mb-4 w-32 min-w-[5rem] origin-top-right divide-y divide-ashgray-100 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-ashgray-800 dark:bg-ashgray-900 sm:w-40">
          {userMenuItems.map(({ label, href, icon, onClick }) => (
            <div key={`${label}${href}`} className="p-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={onClick}
                    className={`${
                      active
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "text-ashgray-900 dark:text-ashgray-100"
                    } group flex w-full items-center rounded px-3 py-3 text-sm font-medium`}
                  >
                    {icon}
                    {label}
                  </button>
                )}
              </Menu.Item>
            </div>
          ))}
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
