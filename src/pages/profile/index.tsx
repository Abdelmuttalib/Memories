import Layout from "@/components/layout/Layout";
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";
import type { Session } from "next-auth";
import Image from "next/image";
import { useState } from "react";
import { api } from "@/utils/api";
import { supabase } from "@/server/supabase";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { decode } from "base64-arraybuffer";
import { Skeleton } from "@/components/ui/skeleton";
import imageCompression from "browser-image-compression";
import { cn } from "@/utils/cn";
import { Heart, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import Memory, { MemoryLoaderUI } from "@/components/memory";

interface ProfilePageProps {
  userSession: Session;
}

const ProfilePage = ({ userSession }: ProfilePageProps) => {
  const { data: memoriesData, isLoading: isLoadingMemories } =
    api.memories.getUserMemories.useQuery();

  const { data: userProfileData, isLoading: isLoadingUserProfileData } =
    api.user.getUserProfileData.useQuery();

  return (
    <>
      <Seo
        title="Profile | Memories"
        description="you can update your profile image and name"
      />
      <Layout>
        <main className="container w-full">
          <div className="flex h-full w-full flex-col items-center justify-center py-12 sm:py-32">
            <div>
              <ProfileImage />
              <div className="flex flex-col items-center gap-y-4 py-4 sm:gap-y-7">
                {/* <div className="flex flex-col gap-y-2 text-sm sm:flex-row sm:gap-x-3 sm:gap-y-0">
                <div>
                  <p className="flex gap-x-1">
                    <span className="font-semibold">56</span>
                    Followers
                  </p>
                </div>
                <div>
                  <p className="flex gap-x-1">
                    <span className="font-semibold">56</span>
                    Following
                  </p>
                </div>
              </div> */}
                <div>
                  <div className="flex items-center gap-x-1">
                    {isLoadingUserProfileData && (
                      <>
                        <Skeleton className="h-7 w-20" />
                        <Skeleton className="h-7 w-16" />
                      </>
                    )}
                    {!isLoadingUserProfileData && userProfileData && (
                      <>
                        <h1 className="text-xl font-medium text-black dark:text-ashgray-100 lg:text-2xl">
                          {userProfileData?.name}
                        </h1>
                        <span className="text-ashgray-700 dark:text-ashgray-600">
                          @{userProfileData?.username}
                        </span>
                      </>
                    )}
                  </div>
                  {/* <p className="text-ashgray-700">{userSession?.user?.email}</p> */}
                </div>
                <div className="flex gap-x-2">
                  {isLoadingMemories && (
                    <Skeleton className="h-8 w-24 rounded-md" />
                  )}
                  {memoriesData && (
                    <div className="w-fit rounded-md border-2 border-ashgray-900 px-3.5 py-1 font-medium text-black dark:text-ashgray-300">
                      <p className="flex gap-x-1">
                        {memoriesData.length} Memories
                      </p>
                    </div>
                  )}
                  {/* <div className="inline-flex w-fit items-center gap-x-2 rounded px-2.5 font-medium text-white">
                    <Heart
                      className={cn("text-brand h-6 w-6 cursor-pointer", {
                        "fill-black text-black dark:fill-taupe dark:text-battleship-gray/70":
                          true,
                      })}
                    />
                    <p className="flex gap-x-1 text-black dark:text-battleship-gray">
                      5 Likes
                    </p>
                  </div> */}
                </div>
              </div>
            </div>
            {/* user memories */}
            <div
              className={cn(
                "grid w-full grid-cols-1 place-content-center place-items-center pb-36 pt-10 sm:pt-20 md:grid-cols-2 lg:grid-cols-3",
                {
                  "gap-1": !memoriesData && isLoadingMemories,
                }
              )}
            >
              {memoriesData &&
                memoriesData.length > 0 &&
                memoriesData?.map((memory) => (
                  <Memory key={memory.id} {...memory} />
                ))}

              {/* loading memories */}
              {!memoriesData &&
                isLoadingMemories &&
                [1, 2, 3, 4, 5].map((_, index) => (
                  <MemoryLoaderUI key={index} />
                ))}

              {/* no memories */}
              {memoriesData && memoriesData.length === 0 && (
                <div className="container mx-auto w-full bg-red-300">
                  <p className="text-lg font-semibold text-gray-400">
                    No memories yet. Create one!
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};

type ImageFile = File | null;

type ProfileFormValues = {
  image: string;
  name: string;
};

export function ProfileImage() {
  const apiContext = api.useContext();
  const [uploading, setUploading] = useState(false);
  const [inputImagePreviewUrl, setInputImagePreviewUrl] = useState<
    string | null
  >(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const updateUserProfileImageMutation =
    api.user.updateUserProfileImage.useMutation({
      onSuccess: async () => {
        toast.success("Image Uploaded Successfully");
        await apiContext.user.getUserProfileData.invalidate();
        setUploading(false);
        setInputImagePreviewUrl(null);
        setImageFile(null);
      },
      onError: () => {
        toast.error("Image Upload Failed");
        setUploading(false);
      },
    });

  const uploadImageToStorage = async (
    imageFilePath: string,
    imageDecodedFileData: ArrayBuffer,
    fileType: string
  ) => {
    const { error: uploadError } = await supabase.storage
      .from("user-profile-images")
      .upload(imageFilePath, imageDecodedFileData, {
        contentType: fileType,
        upsert: true,
      });

    if (uploadError) {
      throw new Error("Unable to upload image to storage");
    }
  };

  function getUploadedImagePublicUrl(imagePath: string) {
    const { data } = supabase.storage
      .from("user-profile-images")
      .getPublicUrl(imagePath);

    const { publicUrl: publicImageUrl } = data;

    return publicImageUrl;
  }

  async function onUploadProfileImage(imageFile: ImageFile) {
    try {
      setUploading(true);
      const inputImage = imageFile;

      if (!inputImage) {
        return;
      }

      const compressedImage = await imageCompression(inputImage, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      const reader = new FileReader();

      reader.readAsDataURL(compressedImage);

      reader.onload = async (e) => {
        const image = e.target?.result as string;

        const imageContentType = image.match(/data:(.*);base64/)?.[1];
        const base64FileData = image.split("base64,")?.[1];

        if (!imageContentType || !base64FileData) {
          throw new Error("Image data not valid");
        }

        const fileName = nanoid();
        const ext = imageContentType?.split("/")[1];
        const path = `${fileName}.${ext as string}`;

        const decodedFileData = decode(base64FileData);
        await uploadImageToStorage(path, decodedFileData, imageContentType);

        const publicImageUrl = getUploadedImagePublicUrl(path);

        // await insertImageToDatabase(publicImageUrl, description, is_public);

        await updateUserProfileImageMutation.mutateAsync({
          image: publicImageUrl,
        });
      };
    } catch (error) {
      console.error(error);
      toast.error("Image Upload Failed");
      setUploading(false);
    }
  }

  const { data: userData, isLoading: isLoadingUserData } =
    api.user.getUserProfileData.useQuery();

  const updateUserInfoMutation = api.user.updateUserProfileData.useMutation({
    onSuccess: async () => {
      toast.success("User info updated successfully");
      await apiContext.user.getUserProfileData.invalidate();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  async function onUpdateInfo(data: ProfileFormValues) {
    if (inputImagePreviewUrl || imageFile) {
      await onUploadProfileImage(imageFile);
    }
    const { name, image } = data;

    await updateUserInfoMutation.mutateAsync({
      name,
      image,
    });
  }

  return (
    <>
      <div className="group relative h-56 w-56 rounded-full">
        {isLoadingUserData && (
          <Skeleton className="h-full w-full rounded-full" />
        )}
        {inputImagePreviewUrl && (
          <Image
            src={inputImagePreviewUrl}
            alt="profile image"
            // width={80}
            // height={80}
            layout="fill"
            className="rounded-full object-cover"
          />
        )}
        {!inputImagePreviewUrl && userData?.image && (
          <Image
            src={userData?.image}
            alt="profile image"
            layout="fill"
            className="rounded-full object-cover"
          />
        )}
        <label
          htmlFor="image"
          className={cn(
            "dark:hover:bg-bray-800 flex h-56 w-56 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-ashgray-600 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-ashgray-700/50 dark:hover:border-gray-500",
            {
              "absolute hidden group-hover:flex group-hover:bg-ashgray-700/50 dark:group-hover:bg-black/50":
                userData?.image && !isLoadingUserData,
              flex:
                !userData?.image && !inputImagePreviewUrl && isLoadingUserData,
              hidden: isLoadingUserData,
            }
          )}
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <Upload className="lg:10 h-6 w-6 text-ashgray-500 sm:h-8 sm:w-8 lg:w-10" />
          </div>
          <input
            id="image"
            type="file"
            className="hidden"
            accept="image/png, image/jpg, image/jpeg"
            // {...register("image", { required: true })}
            onChange={(e) => {
              const imageFileValue = e.target.files;
              if (!imageFileValue) setInputImagePreviewUrl(null);
              if (imageFileValue && imageFileValue[0]) {
                setImageFile(imageFileValue[0]);
                const imagePreviewUrl = URL.createObjectURL(imageFileValue[0]);
                setInputImagePreviewUrl(imagePreviewUrl);
              }
            }}
            disabled={
              uploading ||
              updateUserProfileImageMutation.isLoading ||
              isLoadingUserData ||
              updateUserInfoMutation.isLoading
            }
          />
        </label>
      </div>
      <div className="mx-1 my-2 flex w-full flex-col items-center gap-y-1.5 sm:w-auto sm:flex-row sm:gap-x-2">
        {inputImagePreviewUrl && (
          <Button
            type="button"
            variant="destructive-outline"
            size="icon"
            className="w-fit"
            onClick={() => {
              setImageFile(null);
              setInputImagePreviewUrl(null);
            }}
            disabled={
              uploading ||
              !inputImagePreviewUrl ||
              updateUserProfileImageMutation.isLoading
            }
          >
            <X className="w-5" />
          </Button>
        )}
        {inputImagePreviewUrl && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={async () => {
              if (imageFile) {
                await onUploadProfileImage(imageFile);
              }
            }}
            disabled={
              uploading ||
              !inputImagePreviewUrl ||
              !imageFile ||
              updateUserProfileImageMutation.isLoading
            }
            isLoading={uploading || updateUserProfileImageMutation.isLoading}
            className="inline-flex items-center gap-x-1 sm:flex-1"
          >
            <Upload className="h-5 w-5" />
            Upload
          </Button>
        )}
      </div>
    </>
  );
}

export default ProfilePage;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userSession = await getServerAuthSession({ req, res });

  if (!userSession) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  // return {
  //   redirect: {
  //     destination: "/",
  //     permanent: false,
  //   },
  // };

  return {
    props: {
      userSession,
    },
  };
};
