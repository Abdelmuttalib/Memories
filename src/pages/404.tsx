import { Button, ButtonLink } from "@/components/ui/button";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

export default function NotfoundPage() {
  const { push } = useRouter();

  return (
    <>
      <Head>
        <title>Memories</title>
        <meta name="description" content="share memories" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative flex h-full min-h-[100svh] items-center justify-center bg-black">
        <div className="absolute inset-0 z-10 h-full w-full bg-gradient-to-b from-transparent to-black/30"></div>
        <div className="relative h-[100svh] w-full bg-black">
          <Image
            src="https://images.unsplash.com/photo-1550351731-a56c3f4aeb34?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            // src="https://images.unsplash.com/photo-1479556234618-efd55bac0a26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1161&q=80"
            alt="Fujifilm Camera"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="h-auto w-auto opacity-20"
          />
        </div>
        <div className="absolute z-20 flex flex-col gap-2 px-4 text-center text-slate-200 sm:gap-6">
          <div className="text-center">
            <p className="font-mono text-base font-semibold text-ashgray-500 lg:text-2xl">
              404
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-ashgray-100 sm:text-5xl">
              Page not found
            </h1>
            <p className="mt-6 text-base leading-7 text-ashgray-500">
              Sorry, we couldn&apos;t find the page you&apos;re looking for.
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <ButtonLink
                href="/feed"
                variant="secondary"
                className="w-fit font-medium"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={() => push("/feed")}
              >
                Go back home
              </ButtonLink>
            </div>
          </div>
          {/* <div className="space-y-6">
            <h1 className="font-sans text-5xl font-extrabold uppercase tracking-tighter sm:text-6xl md:text-8xl">
              Memories
            </h1>
            <p className="max-w-sm text-base text-gray-400 sm:max-w-lg md:max-w-3xl md:text-lg">
              Share Life&apos;s Treasured Moments with the World. Capture the
              essence of your most precious memories and share them with the
              world through Memories. Embrace the beauty of heartfelt stories,
              combined with captivating photos, to create lasting impressions.
            </p>
          </div>

          <Button
            variant="secondary"
            className="mx-auto mt-4 w-fit font-medium"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={() => push("/feed")}
          >
            Get Started
          </Button> */}
        </div>
      </main>
    </>
  );
}
