// import AuthFormContainer from "@/components/auth/AuthFormContainer";
// import Layout from "@/components/layout/Layout";
// import { Button, buttonVariants } from "@/components/ui/button";
// import { cn } from "@/utils/cn";
import Head from "next/head";
import Image from "next/image";
// import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Memories</title>
        <meta name="description" content="share memories" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* #0D0C0A */}
      <main className="relative flex h-full min-h-[100svh] items-center justify-center bg-black">
        <div className="relative h-[100svh] w-full bg-black">
          <Image
            src="https://images.unsplash.com/photo-1627892414579-ec3dc44bc31f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
            // src="https://images.unsplash.com/photo-1479556234618-efd55bac0a26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1161&q=80"
            alt="Fujifilm Camera"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="h-auto w-auto opacity-20"
          />
        </div>
        <div className="absolute flex flex-col gap-6 text-center text-slate-200">
          <div className="space-y-6">
            <h1 className="font-sans text-6xl font-extrabold uppercase tracking-tighter md:text-8xl">
              Memories
            </h1>
            <p className="max-w-sm text-base text-gray-400 md:max-w-3xl md:text-lg">
              Share Life&apos;s Treasured Moments with the World. Capture the
              essence of your most precious memories and share them with the
              world through Memories. Embrace the beauty of heartfelt stories,
              combined with captivating photos, to create lasting impressions.
            </p>
          </div>

          <p className="mx-auto mt-4 w-fit rounded-lg bg-gray-900/30 px-4 py-2.5">
            Coming soon...
          </p>
        </div>
      </main>
      {/* <div className="container relative hidden h-[100svh] flex-col items-center justify-center bg-ash-gray/10 md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Button
          variant="ghost"
          size="sm"
          className={cn("absolute right-4 top-4 md:right-8 md:top-8")}
        >
          Login
        </Button>
        <div className="relative hidden h-full flex-col bg-black text-white lg:flex">
          <div className="relative h-full w-full">
            <Image
              src="https://images.unsplash.com/photo-1479556234618-efd55bac0a26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1161&q=80"
              alt="two women taking selfie"
              layout="fill"
              objectFit="cover"
              quality={100}
              className="opacity-50"
              onLoadingComplete={(image) => console.log(image)}
            />
          </div>
          <div className="absolute inset-0 bg-black opacity-60" />
          <div className="absolute top-8 z-20 flex items-center px-4 text-2xl font-bold text-slate-100">
            MEMORIES
          </div>
          <div className="absolute bottom-8 z-20 mt-auto pl-4 pr-8 text-slate-100">
            <blockquote>
              <p className="text-gray-400">
                &ldquo;Share Life&apos;s Treasured Moments with the World.
                Embrace the beauty of heartfelt stories, combined with
                captivating photos, to create lasting impressions.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <AuthFormContainer />
          {/* <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
            </div>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
            A
          </div> 
        </div>
      </div> */}

      {/* <main className="relative flex h-full min-h-[100svh] items-center justify-center bg-black">
        <div className="relative h-[100svh] w-full bg-black">
          <Image
            src="https://images.unsplash.com/photo-1627892414579-ec3dc44bc31f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
            // src="https://images.unsplash.com/photo-1479556234618-efd55bac0a26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1161&q=80"
            alt="Fujifilm Camera"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="h-auto w-auto opacity-20"
          />
        </div>
        <div className="absolute flex flex-col gap-6 text-center text-slate-200">
          <div>
            <h1 className="font-sans text-8xl font-extrabold uppercase tracking-tighter">
              Memories
            </h1>
            <p className="max-w-4xl text-xl font-medium text-gray-600">
              Share Life&apos;s Treasured Moments with the World. Capture the
              essence of your most precious memories and share them with the
              world through Memories. Embrace the beauty of heartfelt stories,
              combined with captivating photos, to create lasting impressions.
            </p>
          </div>

          <Button variant="outline" className="mx-auto w-fit flex-none">
            Get Started
          </Button>
        </div>
      </main> */}
    </>
  );
}
