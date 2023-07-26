/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { supabase } from "@/server/supabase";

export const memoriesRouter = createTRPCRouter({
  getAllMemories: protectedProcedure.query(async ({ ctx }) => {
    const memories = await ctx.prisma.memory.findMany();
    return memories;
  }),
  createMemory: protectedProcedure
    .input(
      z.object({
        description: z.string(),
        image: z.any(),
        imageName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // const memory = await ctx.prisma.post.create({
      //   data: {
      //     description: input.description,
      //     memoryImageUrl: input.memoryImageUrl,
      //   },
      // });
      // return memory;
      // const [image, description] = [
      //   formData.get("image"),
      //   formData.get("description"),
      // ];
      console.log("input: ", input);

      const [description, image] = [
        input.description,
        input.image.replace(/`/g, "") as File,
      ];

      console.log("object: ", image, image.name, description);

      const imagePath = `public/${new Date().getTime()}.${input.imageName}`;
      const { error: uploadError } = await supabase.storage
        .from("memory-image")
        .upload(imagePath, image);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get the URL of the uploaded image
      const {
        data: { publicUrl },
      } = supabase.storage.from("memory-image").getPublicUrl(imagePath);

      // Create a new post in the database with the image URL
      const { data: newMemory, error } = await supabase
        .from("Post")
        .insert({ description: input.description, memoryImageUrl: publicUrl });

      if (error) {
        throw new Error(error.message);
      } else {
        return newMemory;
      }
    }),
});
