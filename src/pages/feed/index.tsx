/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import ImageUpload from "@/components/feed/ImageUpload";
import Layout from "@/components/layout/Layout";
import BlurImage from "@/components/ui/blur-image";
// import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import type { Memory as TMemory } from "@prisma/client";
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

export function MemoryLoaderUI() {
  return (
    <div className="group relative aspect-square max-h-[26rem] w-full cursor-pointer overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none object-left group-hover:scale-110" />
    </div>
  );
}

export function Memory({
  id,
  description,
  memoryImageUrl,
  userId,
  user,
}: TMemory & {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    image: string;
  };
}) {
  const apiContext = api.useContext();

  // const deleteMemoryMutation = api.memories.deleteMemory.useMutation({
  //   onSuccess: async () => {
  //     toast.success("Memory deleted");
  //     await apiContext.memories.getAllMemories.invalidate();
  //   },
  //   onError: (error) => {
  //     toast.error(error.message);
  //   },
  // });

  return (
    <div className="group relative aspect-square max-h-[26rem] w-full cursor-pointer overflow-hidden">
      {/* <Button
        type="button"
        size="sm"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={async () =>
          deleteMemoryMutation.mutateAsync({
            id,
          })
        }
        isLoading={deleteMemoryMutation.isLoading}
        disabled={deleteMemoryMutation.isLoading}
        className="absolute right-2 top-2 z-50 text-red-500 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"
      >
        <Trash2 />
      </Button> */}
      <div className="pt-30 absolute inset-x-0 -bottom-2 z-40 flex cursor-pointer items-end bg-gradient-to-t from-black to-transparent text-white opacity-0 transition duration-300 ease-in-out group-hover:opacity-100">
        <div>
          <div className="translate-y-4 transform-gpu space-y-3 p-4 pb-10 text-xl transition duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
            {/* <div className="font-bold">Jessie Watsica</div>

            <div className="text-sm opacity-60 ">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Distinctio dolores error iure, perferendis sequi totam. Ad aliquam
              aperiam atque deleniti dolor dolorem enim esse et in, inventore
              itaque, pariatur reprehenderit.
            </div> */}

            <p className="text-xl font-bold opacity-90">
              &quot;{description}&quot;
            </p>
            <span className="text-sm font-medium text-ashgray-700">
              by {user?.name}
            </span>
          </div>
        </div>
      </div>
      <BlurImage
        className="aspect-square w-full object-left transition duration-300 ease-in-out group-hover:scale-110"
        src={memoryImageUrl}
        alt={description}
        fill
        objectFit="cover"
      />
    </div>
  );
}

interface FeedPageProps {
  userSession: Session;
}

const FeedPage = ({ userSession }: FeedPageProps) => {
  const { data: memories, isLoading: isLoadingMemories } =
    api.memories.getAllMemories.useQuery();
  return (
    <Layout>
      <main className="w-full">
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
          {memories && memories.length === 0 && (
            <div className="container mx-auto w-full bg-red-300">
              <p className="text-lg font-semibold text-gray-400">
                No memories yet. Create one!
              </p>
            </div>
          )}
        </div>
      </main>
    </Layout>
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
