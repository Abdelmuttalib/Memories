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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";
import Image from "next/image";
import { useSession } from "next-auth/react";
import imageCompression from "browser-image-compression";
import BlurImage from "../ui/blur-image";
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
  const { data: session, status } = useSession();
  console.log("ss", session, status);
  const [uploading, setUploading] = useState(false);
  const [inputImagePreviewUrl, setInputImagePreviewUrl] = useState<
    string | null
  >(null);
  const [isUploading, setIsUploading] = useState(false);
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
      console.log("success creating memory");
      await apiContext.memories.getAllMemories.invalidate();
      setOpen(false);
    },

    onError: (err) => {
      console.log("error creating memory");
      // toast.error(err.message);
    },
  });

  useEffect(() => {
    console.log("s: ", inputImagePreviewUrl);
  }, [inputImagePreviewUrl]);

  async function onImageUpload(data: TImageUploadFormData) {
    // Upload the image to Supabase Storage

    // await createMemoryMutation.mutateAsync({
    //   description: data.description,
    //   image: `${data.file}`,
    //   imageName: data.file.name,
    // });
    setIsUploading(true);

    const file = data.file;
    console.log("size b4: ", file);
    const compressedImage = await compressImage(file);
    console.log("size a4: ", compressedImage);
    const filePath = `public/${new Date().getTime()}.${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("memories-images")
      .upload(filePath, compressedImage);

    if (uploadError) {
      setIsUploading(false);
      console.error("Error uploading image:", uploadError);
      return;
    }

    // Get the URL of the uploaded image
    const {
      data: { publicUrl },
    } = supabase.storage.from("memory-image").getPublicUrl(filePath);

    console.log(data, session?.user?.id);

    // Create a new memory in the database with the image URL
    const { data: newMemory, error } = await supabase.from("Memory").insert({
      description: data.description,
      memoryImageUrl: publicUrl,
      location: data.location,
      userId: session?.user?.id,
    });

    if (error) {
      setIsUploading(false);
      console.error("Error creating memory: ", error);
    } else {
      console.log("Created memory: ", data);
      // toast.success("Memory saved");
      setIsUploading(false);
      await apiContext.memories.getAllMemories.invalidate();
      setOpen(false);
    }
  }

  async function compressImage(imageFile: File) {
    const compressedImage = await imageCompression(imageFile, {
      maxSizeMB: MAX_IMAGE_SIZE_MB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });

    return compressedImage;
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
                  variant="destructive-outline"
                  disabled={uploading}
                  className="group absolute bottom-2 right-2 transform rounded-full transition-all duration-500 ease-in-out"
                  size="sm"
                >
                  <XMarkIcon className="w-5" />
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="flex flex-col p-2">
                <label
                  htmlFor="imageUpload"
                  className="flex h-96 w-full cursor-pointer items-center justify-center rounded border-2 border-dashed p-8 font-semibold"
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                      aria-hidden="true"
                      className="mb-3 h-10 w-10 text-gray-400"
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
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF
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
                    className="hidden bg-red-300"
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

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="enter your memory description"
            className="resize-none rounded-none border-none bg-slate-50 text-2xl font-medium text-slate-600 ring-0 placeholder:text-slate-400 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        )}
      />
      {errors.description && <p>{errors.description.message}</p>}

      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <div className="flex items-center">
            <MapPinIcon className="absolute left-2 w-6 text-slate-600" />
            <Input
              {...field}
              placeholder="enter location"
              className="resize-none rounded-none border-none bg-slate-50 pl-10 text-lg font-medium text-slate-600 ring-0 placeholder:text-slate-400 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        )}
      />
      {errors.location && <p>{errors.location.message}</p>}

      <div className="grid gap-4 px-4">
        <Button
          type="submit"
          disabled={isUploading}
          isLoading={isUploading}
          // disabled={createMemoryMutation.isLoading}
          // isLoading={createMemoryMutation.isLoading}
        >
          Share Memory
        </Button>
      </div>
    </form>
  );
}

const ImageUploadDialog: FC<{
  children: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ children, open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Share Memory</Button>
      </DialogTrigger>
      <DialogContent className="border-none bg-white p-0 pb-4 sm:max-w-xl">
        {/* <DialogHeader> */}
        {/* <DialogTitle>Add a new memory</DialogTitle> */}
        {/* <DialogDescription>
            Share your memory with the world
          </DialogDescription> */}
        {/* </DialogHeader> */}
        {children}
      </DialogContent>
    </Dialog>
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
