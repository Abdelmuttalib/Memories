/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/utils/cn";
import { ButtonLink } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { HomeIcon, PlusIcon, UserIcon } from "@heroicons/react/20/solid";
import { LogIn, LogOut, Plus, PlusCircle, User } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import ImageUpload from "../feed/ImageUpload";
import MainNav from "./MainNav";
import { type ReactNode } from "react";

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
      {/* header */}
      <Header />
      {/* main */}
      <main className="relative h-[100svh] w-full flex-1">{children}</main>
      {/* footer */}
      <footer></footer>

      {/*  */}
      <MainNav />
    </div>
  );
}
