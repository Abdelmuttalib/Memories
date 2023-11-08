/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import ImageUpload from "@/components/feed/ImageUpload";
import Seo from "@/components/Seo";
import ImageUpload from "@/components/feed/ImageUpload";
import Layout from "@/components/layout/Layout";
import Memory, { MemoryLoaderUI } from "@/components/memory";
import BlurImage from "@/components/ui/blur-image";
import { ButtonLink } from "@/components/ui/button";
// import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import type { Memory as TMemory, User } from "@prisma/client";
import { LogIn } from "lucide-react";
// import { Trash2 } from "lucide-react";
import type { GetServerSideProps } from "next";
import type { Session } from "next-auth";
// import Image from "next/image";
import React from "react";
// import { toast } from "sonner";

// <div
//   key={memory.id}
//   className="flex h-full w-full flex-col space-y-2"
// >
//   <div className="min-h-9/12 relative h-[26rem] rounded-sm bg-primary">
//     <Image
//       src={memory.memoryImageUrl}
//       alt={memory.description}
//       // width={350}
//       // height={300}
//       layout="fill"
//       className="h-auto w-auto rounded-sm object-cover hover:object-contain"
//     />
//   </div>
//   <p className="text-xl font-bold">
//     &quot;{memory.description}&quot;
//   </p>
// </div>

interface FeedPageProps {
  userSession: Session;
}

const FeedPage = ({ userSession }: FeedPageProps) => {
  const { data: memories, isLoading: isLoadingMemories } =
    api.memories.getAllMemories.useQuery();

  return (
    <>
      <Seo title="Feed | Memories" />
      <Layout>
        <main className="w-full">
          {memories && memories.length === 0 && userSession && (
            <div className="container mx-auto my-20 flex w-fit flex-col items-center gap-y-6 xl:my-40">
              <p className="text-lg text-ashgray-600">
                No memories yet. Create one!
              </p>
              <ImageUpload />
            </div>
          )}
          {memories && memories.length === 0 && !userSession && (
            <div className="container mx-auto my-20 flex w-fit flex-col items-center gap-y-6 xl:my-40">
              <p className="text-lg text-ashgray-600">
                No memories yet. Sign in to share memories
              </p>
              <ButtonLink
                href="/sign-in"
                variant="outline"
                size="sm"
                className="flex w-fit items-center gap-x-1.5"
              >
                Sign In
                <LogIn className="w-5" />
              </ButtonLink>
            </div>
          )}
          <div
            className={cn(
              "grid w-full grid-cols-1 place-content-center place-items-center pb-36 md:grid-cols-2 lg:grid-cols-3",
              {
                "gap-1": !memories && isLoadingMemories,
              }
            )}
          >
            {memories &&
              memories.length > 0 &&
              memories?.map((memory) => <Memory key={memory.id} {...memory} />)}

            {/* loading memories */}
            {!memories &&
              isLoadingMemories &&
              [1, 2, 3, 4, 5].map((_, index) => <MemoryLoaderUI key={index} />)}

            {/* no memories */}
          </div>
        </main>
      </Layout>
    </>
  );
};

export default FeedPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userSession = await getServerAuthSession(context);

  // if (!userSession) {
  //   return {
  //     redirect: {
  //       destination: "/auth/sign-in",
  //       permanent: false,
  //     },
  //   };
  // }

  // return {
  //   redirect: {
  //     destination: "/",
  //     permanent: false,
  //   },
  // };

  return {
    props: {
      userSession: JSON.parse(JSON.stringify(userSession)),
    },
  };
};
