import React from "react";
import { ButtonLink } from "../ui/button";
import { useRouter } from "next/router";
import Image from "next/image";

type LoginLayoutProps = {
  children: React.ReactNode;
};

export default function LoginLayout({ children }: LoginLayoutProps) {
  const { pathname } = useRouter();

  function renderRedirectAuthLink() {
    if (pathname === "/sign-in") {
      return (
        <ButtonLink
          href="/register"
          variant="outline"
          size="sm"
          className="absolute right-4 top-4 md:right-8 md:top-8"
        >
          Create Account
        </ButtonLink>
      );
    }
    return (
      <ButtonLink
        href="/sign-in"
        variant="outline"
        size="sm"
        className="absolute right-4 top-4 md:right-8 md:top-8"
      >
        Login
      </ButtonLink>
    );
  }
  return (
    <div className="container relative h-[100svh] flex-col items-center justify-center px-0 dark:bg-black lg:grid lg:max-w-none lg:grid-cols-5 lg:px-0">
      <div className="relative hidden h-full flex-col bg-black text-white lg:col-span-3 lg:block">
        <div className="relative h-full w-full">
          <Image
            src="https://images.unsplash.com/photo-1479556234618-efd55bac0a26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1161&q=80"
            alt="two women taking selfie"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="bg-black opacity-50"
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="absolute top-8 z-20 flex items-center px-7 py-2 text-lg font-bold text-zinc-300">
          MEMORIES
        </div>
        <div className="absolute bottom-8 z-20 mt-auto px-7 py-2">
          <blockquote className="text-lg text-zinc-500">
            &ldquo;Share Life&apos;s Treasured Moments with the World.&ldquo;
            {/* Embrace
      the beauty of heartfelt stories, combined with captivating photos,
      to create lasting impressions.&rdquo; */}
          </blockquote>
        </div>
      </div>

      <div className="relative block h-full dark:bg-black lg:col-span-2 lg:p-8">
        {renderRedirectAuthLink()}
        <div className="mx-auto flex h-full w-full max-w-lg flex-col items-center justify-center gap-4 rounded-r-lg px-6 py-10 sm:px-20 sm:py-20">
          {children}
        </div>
      </div>
    </div>
  );
}
