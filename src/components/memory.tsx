import { api } from "@/utils/api";
import { Skeleton } from "./ui/skeleton";
import type { MemoryLike, Memory as TMemory, User } from "@prisma/client";
import BlurImage from "./ui/blur-image";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/utils/cn";

export default function Memory({
  id,
  description,
  memoryImageUrl,
  userId,
  user,
  likes,
}: TMemory & {
  user: any;
  likes: MemoryLike[];
}) {
  const { data: session } = useSession();
  const apiContext = api.useContext();

  const userLikedMemory = session
    ? likes.some((like: MemoryLike) => like.userId === session?.user.id)
    : false;

  // const deleteMemoryMutation = api.memories.deleteMemory.useMutation({
  //   onSuccess: async () => {
  //     toast.success("Memory deleted");
  //     await apiContext.memories.getAllMemories.invalidate();
  //   },
  //   onError: (error) => {
  //     toast.error(error.message);
  //   },
  // });

  const likeMemoryMutation = api.memories.likeMemory.useMutation({
    onSuccess: async () => {
      toast.success("Liked Memory");
      await apiContext.memories.getAllMemories.invalidate();
    },
    onError: () => {
      toast.error("Error liking memory");
    },
  });

  const unlikeMemoryMutation = api.memories.unlikeMemory.useMutation({
    onSuccess: async () => {
      toast.success("Unliked Memory");
      await apiContext.memories.getAllMemories.invalidate();
    },
    onError: () => {
      toast.error("Error unliking memory");
    },
  });

  async function onLikeMemory() {
    await likeMemoryMutation.mutateAsync({
      memoryId: id,
    });
  }

  async function onUnlikeMemory() {
    await unlikeMemoryMutation.mutateAsync({
      memoryId: id,
    });
  }

  // toast.promise(promise,
  //   {
  //     loading: "Loading...",
  //     success: (data) => {
  //       return `1 toast has been added`;
  //     },
  //     error: "Error",
  //   }
  // );

  async function handleLikeClick() {
    if (userLikedMemory) {
      // User has already liked the memory, so handle unlike memory.
      await onUnlikeMemory();
    } else {
      // User has not liked the memory, so handle like memory.
      await onLikeMemory();
    }
  }

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
      <div className="absolute inset-x-0 -bottom-2 z-40 flex cursor-pointer items-end bg-gradient-to-t from-black to-transparent text-white opacity-0 transition duration-300 ease-in-out group-hover:opacity-100">
        <div className="w-full">
          <div className="flex w-full translate-y-4 transform-gpu items-start justify-between space-y-3 p-4 pb-10 text-xl transition duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
            {/* <div className="font-bold">Jessie Watsica</div>

            <div className="text-sm opacity-60 ">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Distinctio dolores error iure, perferendis sequi totam. Ad aliquam
              aperiam atque deleniti dolor dolorem enim esse et in, inventore
              itaque, pariatur reprehenderit.
            </div> */}

            <div>
              <p className="text-xl font-bold opacity-90">
                &quot;{description}&quot;
              </p>
              <span className="text-sm font-medium text-ashgray-700">
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                by {user?.name}
              </span>
            </div>
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={handleLikeClick}
                disabled={
                  likeMemoryMutation.isLoading || unlikeMemoryMutation.isLoading
                }
                className="disabled:opacity-30"
              >
                <Heart
                  className={cn("w-6 text-white", {
                    "fill-white": userLikedMemory,
                  })}
                />
              </button>
              {likes && (
                <span
                  className={cn({
                    "opacity-40":
                      likeMemoryMutation.isLoading ||
                      unlikeMemoryMutation.isLoading,
                  })}
                >
                  {likes?.length}
                </span>
              )}
              {/* {memoryLikesCount && <span>{memoryLikesCount}</span>} */}
            </div>
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

export function MemoryLoaderUI() {
  return (
    <div className="group relative aspect-square max-h-[26rem] w-full cursor-pointer overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none object-left group-hover:scale-110" />
    </div>
  );
}
