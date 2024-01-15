/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, {
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  useRef,
  useState,
  useEffect,
  Fragment,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/server/supabase";
import { MapPinIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { prisma } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";
import Image from "next/image";
import { useSession } from "next-auth/react";
import imageCompression from "browser-image-compression";
import BlurImage from "../ui/blur-image";
import { nanoid } from "nanoid";
import { decode } from "base64-arraybuffer";
import { toast } from "sonner";
import { Dialog, Transition } from "@headlessui/react";
import { Plus } from "lucide-react";
import { USER_SESSION_STATUS } from "@/utils/user-session-status";
import { useRouter } from "next/router";
// import { toast } from "sonner";

const MAX_FILE_SIZE = 500000;
const MAX_IMAGE_SIZE_MB = 4;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const imageUploadSchema = z.object({
  file: z.any(),
  // .refine((files: FileList) => files?.length > 0, "Image is required.")
  // .refine(
  //   (files) => files?.[0]?.size <= MAX_FILE_SIZE,
  //   `Max file size is 5MB.`
  // )
  // .refine(
  //   (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
  //   ".jpg, .jpeg, .png and .webp files are accepted."
  // ),
  description: z
    .string()
    .nonempty({ message: "Please enter a description" })
    .min(1, { message: "Description must be at least 1 characters long" }),

  location: z.string().nonempty({ message: "Please enter a location" }),
});

type TImageUploadFormData = z.infer<typeof imageUploadSchema>;

function ImageUploadForm({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { push, pathname } = useRouter();
  const { data: session, status } = useSession();
  const [uploading, setUploading] = useState(false);
  const [inputImagePreviewUrl, setInputImagePreviewUrl] = useState<
    string | null
  >(null);
  const apiContext = api.useContext();
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<TImageUploadFormData>({
    resolver: zodResolver(imageUploadSchema),
  });

  const createMemoryMutation = api.memories.createMemory.useMutation({
    onSuccess: async () => {
      // toast.success("User created successfully");
      // setAuthType("sign-in");
      await apiContext.memories.getAllMemories.invalidate();
      toast.success("Memory saved");
      setUploading(false);
      setOpen(false);
      if (pathname !== "/feed") {
        push("/feed");
      }
    },

    onError: (err) => {
      // console.log("error creating memory");
      toast.error("error creating memory");
      // toast.error(err.message);
    },
  });

  async function compressImage(imageFile: File) {
    const compressedImage = await imageCompression(imageFile, {
      maxSizeMB: MAX_IMAGE_SIZE_MB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });

    return compressedImage;
  }

  const uploadImageToStorage = async (
    imageFilePath: string,
    imageDecodedFileData: ArrayBuffer,
    fileType: string
  ) => {
    const { error: uploadError } = await supabase.storage
      .from("memory-images")
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
      .from("memory-images")
      .getPublicUrl(imagePath);

    const { publicUrl: publicImageUrl } = data;

    return publicImageUrl;
  }

  async function onImageUpload(data: any) {
    try {
      setUploading(true);
      const inputImage = data.file;

      if (!inputImage) {
        return;
      }

      const compressedImage = await compressImage(inputImage);

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
        const path = `${fileName}${new Date().getTime()}.${ext as string}`;

        const decodedFileData = decode(base64FileData);
        await uploadImageToStorage(path, decodedFileData, imageContentType);

        const memoryPublicImageUrl = getUploadedImagePublicUrl(path);

        await createMemoryMutation.mutateAsync({
          memoryImageUrl: memoryPublicImageUrl,
          description: data.description,
          location: data.location,
        });
      };
    } catch (error) {
      // console.error("error: ", error);
      toast.error("Image Upload Failed");
      setUploading(false);
    }
  }

  // const onUploadAndCompressOnClient = async (
  //   data: UploadImageFieldsT,
  //   compress: boolean
  // ) => {
  //   const {
  //     imageFile: imageFiles,
  //     description,
  //     // compressImageOnClient,
  //     // compressImageOnServer,
  //     compressImage: compressImageForm,
  //     is_public,
  //   } = data;

  //   const inputImage = imageFiles && imageFiles[0];

  //   if (!inputImage) {
  //     return;
  //   }

  //   const compressedImage = await imageCompression(inputImage, {
  //     maxSizeMB: 1,
  //     maxWidthOrHeight: 1920,
  //     useWebWorker: true,
  //   });

  //   const reader = new FileReader();

  //   reader.readAsDataURL(compress ? compressedImage : inputImage);

  //   reader.onload = async (e) => {
  //     const image = e.target?.result as string;

  //     const imageContentType = image.match(/data:(.*);base64/)?.[1];
  //     const base64FileData = image.split("base64,")?.[1];

  //     if (!imageContentType || !base64FileData) {
  //       throw new Error("Image data not valid");
  //     }

  //     const fileName = nanoid();
  //     const ext = imageContentType?.split("/")[1];
  //     const path = `${fileName}.${ext}`;

  //     const decodedFileData = decode(base64FileData);
  //     await uploadImageToStorage(path, decodedFileData, imageContentType);

  //     const publicImageUrl = await getUploadedImagePublicUrl(path);

  //     await insertImageToDatabase(publicImageUrl, description, is_public);
  //   };
  // };

  return (
    <form onSubmit={handleSubmit(onImageUpload)} className="grid gap-4">
      <Controller
        name="file"
        control={control}
        defaultValue={undefined}
        render={({ field: { onChange, ref, value, ...inputProps } }) => (
          <div className="rounded-t-lg">
            {inputImagePreviewUrl ? (
              <div className="relative flex flex-col gap-2.5">
                <div className="relative h-96">
                  <Image
                    src={inputImagePreviewUrl}
                    alt=""
                    // width={300}
                    // height={240}
                    layout="fill"
                    className="rounded rounded-b-none rounded-t-lg object-cover"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    setValue("file", undefined);
                    setInputImagePreviewUrl(null);
                  }}
                  // className="flex items-center justify-center rounded-md border border-gray-300 bg-transparent px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  variant="secondary"
                  disabled={uploading}
                  className="group absolute right-2 top-2 pl-3 font-medium"
                  size="sm"
                >
                  <XMarkIcon className="w-5 sm:w-6" />
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="flex flex-col p-2">
                <label
                  htmlFor="imageUpload"
                  className="group flex h-96 w-full cursor-pointer items-center justify-center rounded border-2 border-dashed border-ashgray-300 p-8 font-semibold hover:bg-ashgray-100 dark:border-ashgray-800 dark:hover:bg-ashgray-900"
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                      aria-hidden="true"
                      className="mb-3 h-10 w-10 transform text-ashgray-600 transition-all duration-200 ease-in-out group-hover:-mt-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm ">
                      <span className="font-semibold text-black underline decoration-2 underline-offset-2 dark:text-white">
                        Click to upload
                      </span>
                      {/* or
                      drag and drop */}
                    </p>
                    <p className="text-xs text-ashgray-600">
                      PNG, JPG or JPEG
                      {/* (MAX. 800x400px) */}
                    </p>
                  </div>
                  <Input
                    {...inputProps}
                    id="imageUpload"
                    type="file"
                    onChange={(e) => {
                      // console.log("e: ", e);
                      if (e?.target?.files?.length && e.target.files[0]) {
                        const imagePreviewUrl = URL.createObjectURL(
                          e.target.files[0]
                        );
                        setInputImagePreviewUrl(imagePreviewUrl);
                      }
                      onChange(
                        e?.target?.files?.length ? e.target.files[0] : null
                      );
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        )}
      />
      {/* {errors.file?.message && (
        <p className="text-red-500">{errors.file.message || "Unknown error"}</p>
      )} */}

      <div className="grid gap-4 px-4">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="describe your memory"
              className="h-32 resize-none border-none text-xl font-medium ring-0  focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 md:text-2xl"
            />
          )}
        />
        {errors.description && <p>{errors.description.message}</p>}

        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <div className="relative flex items-center">
              <MapPinIcon className="absolute right-2 w-6 text-ashgray-800" />
              <Input
                {...field}
                placeholder="where this memory was captured (location)"
                className="pr-10 text-lg font-medium ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                inputMode="text"
                type="text"
              />
            </div>
          )}
        />
        {errors.location && <p>{errors.location.message}</p>}

        <div className="mb-6 mt-2 flex flex-col gap-y-2 sm:mt-4 sm:flex-row-reverse sm:gap-x-2 sm:gap-y-0">
          <Button
            type="submit"
            className="sm:flex-1"
            disabled={uploading}
            isLoading={uploading}
            // disabled={createMemoryMutation.isLoading}
            // isLoading={createMemoryMutation.isLoading}
          >
            Share Memory
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => setOpen(false)}
            // isLoading={uploading}
            // disabled={createMemoryMutation.isLoading}
            // isLoading={createMemoryMutation.isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}

const ImageUploadDialog: FC<{
  children: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ children, open, setOpen }) => {
  const { data: session, status } = useSession();
  return (
    <>
      {/* <Button type="button" onClick={() => setOpen(true)}>
        Share Memory
      </Button> */}
      <Button
        size="icon"
        onClick={() => setOpen(true)}
        disabled={status === USER_SESSION_STATUS.UNAUTHENTICATED}
        className="px-4 font-medium"
      >
        <Plus className="mr-1 w-5" /> Share Memory
      </Button>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-90" />
          </Transition.Child>

          {/* <DialogTrigger asChild>
        <Button type="button">Share Memory</Button>
      </DialogTrigger>
      <DialogContent className="border-none bg-white p-0 pb-4 sm:max-w-xl">
        {children}
      </DialogContent> */}

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white px-0 py-0 text-left align-middle shadow-xl transition-all dark:bg-ashgray-900">
                  {/* <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Payment successful
                </Dialog.Title> */}
                  {/* <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Your payment has been successfully submitted. We’ve sent you
                    an email with all of the details of your order.
                  </p>
                </div> */}
                  <div className="h-full w-full dark:bg-black/70">
                    {children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>{" "}
    </>
  );
};

const ImageUpload = () => {
  const [open, setOpen] = useState(false);
  return (
    <ImageUploadDialog open={open} setOpen={setOpen}>
      <div className="">
        <ImageUploadForm setOpen={setOpen} />
      </div>
    </ImageUploadDialog>
  );
};

export default ImageUpload;

// import Container from "@/components/@pages/landing-page/container";
// import { Layout } from "@/components/layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Skeleton } from "@/components/ui/skeleton";
// import { getServerAuthSession } from "@/server/auth";
// import { api } from "@/utils/api";
// import { cn } from "@/utils/cn";
// import supabase from "@/utils/supabase";
// import { XMarkIcon } from "@heroicons/react/20/solid";
// import { decode } from "base64-arraybuffer";
// import imageCompression from "browser-image-compression";
// import { type ClassValue } from "clsx";
// import { Upload } from "lucide-react";
// import { nanoid } from "nanoid";
// import { type GetServerSideProps } from "next";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";
// import { SettingsPageTabs } from ".";

// const profileFormSchema = z.object({
//   firstName: z.string(),
//   lastName: z.string(),
//   image: z.any(),
// });

// type ProfileFormValues = z.infer<typeof profileFormSchema>;

// export function UploadIcon({ className }: { className?: ClassValue }) {
//   return (
//     <svg
//       className={cn("mb-4 h-8 w-8 text-gray-500 dark:text-gray-400", className)}
//       aria-hidden="true"
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 20 16"
//     >
//       <path
//         stroke="currentColor"
//         stroke-linecap="round"
//         stroke-linejoin="round"
//         stroke-width="1"
//         d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
//       />
//     </svg>
//   );
// }

// export default function SettingsProfilePage() {
//   return (
//     <Layout pageTitle="">
//       <SettingsPageTabs />
//     </Layout>
//   );
// }

// type ImageFile = File | null;

// export function ProfileSettings() {
//   const { data: session } = useSession();
//   const user = session?.user;
//   const apiContext = api.useContext();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ProfileFormValues>();
//   const [uploading, setUploading] = useState(false);
//   const [inputImagePreviewUrl, setInputImagePreviewUrl] = useState<
//     string | null
//   >(null);
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const updateUserProfileImageMutation =
//     api.user.updateUserProfileImage.useMutation({
//       onSuccess: async () => {
//         toast.success("Image Uploaded Successfully");
//         await apiContext.user.getUser.invalidate();
//         setUploading(false);
//         setInputImagePreviewUrl(null);
//         setImageFile(null);
//       },
//       onError: () => {
//         toast.error("Image Upload Failed");
//         setUploading(false);
//       },
//     });

//   const uploadImageToStorage = async (
//     imageFilePath: string,
//     imageDecodedFileData: ArrayBuffer,
//     fileType: string
//   ) => {
//     const { error: uploadError } = await supabase.storage
//       .from("user-profile-images")
//       .upload(imageFilePath, imageDecodedFileData, {
//         contentType: fileType,
//         upsert: true,
//       });

//     if (uploadError) {
//       throw new Error("Unable to upload image to storage");
//     }
//   };

//   function getUploadedImagePublicUrl(imagePath: string) {
//     const { data } = supabase.storage
//       .from("user-profile-images")
//       .getPublicUrl(imagePath);

//     const { publicUrl: publicImageUrl } = data;

//     return publicImageUrl;
//   }

//   async function onUploadProfileImage(imageFile: ImageFile) {
//     try {
//       setUploading(true);
//       const inputImage = imageFile;

//       if (!inputImage) {
//         return;
//       }

//       const compressedImage = await imageCompression(inputImage, {
//         maxSizeMB: 1,
//         maxWidthOrHeight: 1920,
//         useWebWorker: true,
//       });

//       const reader = new FileReader();

//       reader.readAsDataURL(compressedImage);

//       reader.onload = async (e) => {
//         const image = e.target?.result as string;

//         const imageContentType = image.match(/data:(.*);base64/)?.[1];
//         const base64FileData = image.split("base64,")?.[1];

//         if (!imageContentType || !base64FileData) {
//           throw new Error("Image data not valid");
//         }

//         const fileName = nanoid();
//         const ext = imageContentType?.split("/")[1];
//         const path = `${fileName}.${ext as string}`;

//         const decodedFileData = decode(base64FileData);
//         await uploadImageToStorage(path, decodedFileData, imageContentType);

//         const publicImageUrl = getUploadedImagePublicUrl(path);

//         // await insertImageToDatabase(publicImageUrl, description, is_public);

//         await updateUserProfileImageMutation.mutateAsync({
//           userId: user?.id as string,
//           image: publicImageUrl,
//         });
//       };
//     } catch (error) {
//       console.error(error);
//       toast.error("Image Upload Failed");
//       setUploading(false);
//     }
//   }

//   const { data: userData, isLoading: isLoadingUserData } =
//     api.user.getUser.useQuery({
//       userId: user?.id as string,
//     });

//   const updateUserInfoMutation = api.user.updateUserInfo.useMutation({
//     onSuccess: async () => {
//       toast.success("User info updated successfully");
//       await apiContext.user.getUser.invalidate();
//     },
//     onError: () => {
//       toast.error("Something went wrong");
//     },
//   });

//   async function onUpdateInfo(data: ProfileFormValues) {
//     if (inputImagePreviewUrl || imageFile) {
//       await onUploadProfileImage(imageFile);
//     }
//     const { firstName, lastName } = data;

//     await updateUserInfoMutation.mutateAsync({
//       userId: user?.id as string,
//       firstName,
//       lastName,
//     });
//   }
//   return (
//     <Container className="flex flex-col gap-10 py-3 sm:py-7">
//       <div className="w-full">
//         <h1 className="h5">Profile Settings</h1>
//       </div>

//       <div className="flex flex-col gap-7 divide-y-2">
//         <div className="flex w-full flex-col gap-x-4 gap-y-4 md:flex-row">
//           {/* profile image uploader */}
//           <div className="h-fit ">
//             {/* upload */}

//             <div className="flex flex-col items-center gap-y-2 sm:flex-row sm:gap-x-4 lg:flex-col">
//               <div className="group relative h-24 w-24">
//                 {isLoadingUserData && (
//                   <Skeleton className="h-full w-full rounded-full" />
//                 )}
//                 {inputImagePreviewUrl && (
//                   <Image
//                     src={inputImagePreviewUrl}
//                     alt="profile image"
//                     // width={80}
//                     // height={80}
//                     layout="fill"
//                     className="rounded-full object-cover"
//                   />
//                 )}
//                 {!inputImagePreviewUrl && userData?.image && (
//                   <Image
//                     src={userData?.image}
//                     alt="profile image"
//                     layout="fill"
//                     className="rounded-full object-cover"
//                   />
//                 )}
//                 <label
//                   htmlFor="image"
//                   className={cn(
//                     "dark:hover:bg-bray-800 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600",
//                     {
//                       "absolute hidden group-hover:flex group-hover:bg-gray-50/50":
//                         userData?.image && !isLoadingUserData,
//                       flex:
//                         !userData?.image &&
//                         !inputImagePreviewUrl &&
//                         isLoadingUserData,
//                       hidden: isLoadingUserData,
//                     }
//                   )}
//                 >
//                   <div className="flex flex-col items-center justify-center pb-6 pt-5">
//                     <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400" />
//                   </div>
//                   <input
//                     id="image"
//                     type="file"
//                     className="hidden"
//                     accept="image/png, image/jpg, image/jpeg"
//                     // {...register("image", { required: true })}
//                     onChange={(e) => {
//                       const imageFileValue = e.target.files;
//                       if (!imageFileValue) setInputImagePreviewUrl(null);
//                       if (imageFileValue && imageFileValue[0]) {
//                         setImageFile(imageFileValue[0]);
//                         const imagePreviewUrl = URL.createObjectURL(
//                           imageFileValue[0]
//                         );
//                         setInputImagePreviewUrl(imagePreviewUrl);
//                       }
//                     }}
//                     disabled={
//                       uploading ||
//                       updateUserProfileImageMutation.isLoading ||
//                       isLoadingUserData ||
//                       updateUserInfoMutation.isLoading
//                     }
//                   />
//                 </label>
//               </div>
//               <div className="mx-1 flex w-full flex-col gap-y-1.5 sm:w-auto">
//                 <Button
//                   type="button"
//                   size="sm"
//                   // eslint-disable-next-line @typescript-eslint/no-misused-promises
//                   onClick={async () => {
//                     if (imageFile) {
//                       await onUploadProfileImage(imageFile);
//                     }
//                   }}
//                   disabled={
//                     uploading ||
//                     !inputImagePreviewUrl ||
//                     !imageFile ||
//                     updateUserProfileImageMutation.isLoading
//                   }
//                   isLoading={
//                     uploading || updateUserProfileImageMutation.isLoading
//                   }
//                   className="inline-flex w-full items-center gap-x-1"
//                 >
//                   <Upload className="h-4 w-4" />
//                   Upload
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline-destructive"
//                   size="sm"
//                   onClick={() => {
//                     setImageFile(null);
//                     setInputImagePreviewUrl(null);
//                   }}
//                   disabled={
//                     uploading ||
//                     !inputImagePreviewUrl ||
//                     updateUserProfileImageMutation.isLoading
//                   }
//                 >
//                   <XMarkIcon className="h-4 w-4" />
//                   Remove Image
//                 </Button>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col gap-2 pb-8">
//             <div className="py-2">
//               <form
//                 // eslint-disable-next-line @typescript-eslint/no-misused-promises
//                 onSubmit={handleSubmit(onUpdateInfo)}
//                 className="flex flex-col gap-5 divide-y-2"
//               >
//                 <div className="flex w-full flex-col space-y-4">
//                   <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-end lg:w-fit lg:space-y-4">
//                     <div className="relative w-full">
//                       <Label
//                         htmlFor="firstName"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         First Name
//                       </Label>
//                       <Input
//                         id="firstName"
//                         inputMode="text"
//                         type="text"
//                         placeholder="first name"
//                         {...register("firstName", {
//                           required: true,
//                         })}
//                         defaultValue={userData?.firstName || ""}
//                         disabled={
//                           isLoadingUserData ||
//                           updateUserInfoMutation.isLoading ||
//                           uploading
//                         }
//                         error={errors?.firstName}
//                       />
//                     </div>
//                     <div className="relative w-full">
//                       <Label
//                         htmlFor="lastName"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Last Name
//                       </Label>
//                       <Input
//                         id="lastName"
//                         inputMode="text"
//                         type="text"
//                         placeholder="last name"
//                         {...register("lastName", {
//                           required: true,
//                         })}
//                         defaultValue={userData?.lastName || ""}
//                         disabled={
//                           isLoadingUserData ||
//                           updateUserInfoMutation.isLoading ||
//                           uploading
//                         }
//                         error={errors?.lastName}
//                       />
//                     </div>
//                   </div>
//                   <Button
//                     type="submit"
//                     className="sm:w-fit sm:self-end"
//                     isLoading={updateUserInfoMutation.isLoading || uploading}
//                     disabled={
//                       isLoadingUserData ||
//                       updateUserInfoMutation.isLoading ||
//                       uploading
//                     }
//                   >
//                     Save Changes
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Container>
//   );
// }

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   const userSession = await getServerAuthSession({ req, res });

//   if (!userSession) {
//     return {
//       redirect: {
//         destination: "/sign-in",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };
