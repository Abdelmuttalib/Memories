/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import ImageUpload from "@/components/feed/ImageUpload";
import Layout from "@/components/layout/Layout";
import BlurImage from "@/components/ui/blur-image";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import type { Memory as TMemory } from "@prisma/client";
import type { GetServerSideProps } from "next";
import type { Session } from "next-auth";
// import Image from "next/image";
import React from "react";

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

function Memory({ description, memoryImageUrl }: TMemory) {
  return (
    <div className="group relative aspect-square max-h-[26rem] w-full cursor-pointer overflow-hidden">
      <div className="pt-30 absolute inset-x-0 -bottom-2 z-50 flex cursor-pointer items-end bg-gradient-to-t from-black to-transparent text-white opacity-0 transition duration-300 ease-in-out group-hover:opacity-100">
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
          </div>
        </div>
      </div>
      <BlurImage
        className="aspect-square w-full object-cover transition duration-300 ease-in-out group-hover:scale-110"
        src={memoryImageUrl}
        alt={description}
        layout="fill"
      />
    </div>
  );
}

interface FeedPageProps {
  userSession: Session;
}

const FeedPage = ({ userSession }: FeedPageProps) => {
  const { data: memories } = api.memories.getAllMemories.useQuery();
  console.log("memories: ", memories, userSession);
  return (
    <Layout>
      <main className="w-full">
        <div className="container flex w-full justify-between py-6">
          <h1 className="text-4xl font-bold">Feed</h1>
          <ImageUpload />
        </div>
        <div className="grid w-full grid-cols-1 place-content-center place-items-center pb-36 pt-10 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {memories?.map((memory) => (
            <Memory key={memory.id} {...memory} />
          ))}
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

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };

  return {
    props: {
      userSession: JSON.parse(JSON.stringify(userSession)),
    },
  };
};
