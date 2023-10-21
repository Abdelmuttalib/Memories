/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const memoriesRouter = createTRPCRouter({
  getAllMemories: publicProcedure.query(async ({ ctx }) => {
    const memories = await ctx.prisma.memory.findMany({
      // include user data to return
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return memories;
  }),
  createMemory: protectedProcedure
    .input(
      z.object({
        memoryImageUrl: z.string(),
        description: z.string(),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session?.user;
      const memory = await ctx.prisma.memory.create({
        data: {
          memoryImageUrl: input.memoryImageUrl,
          description: input.description,
          location: input.location,
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
      return memory;
    }),

  // createMemory: protectedProcedure
  //   .input(
  //     z.object({
  //       memoryImageUrl: z.string(),
  //       description: z.string(),
  //       location: z.string().optional(),
  //     })
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     const user = ctx.session?.user;
  //     const memory = await ctx.prisma.memory.create({
  //       data: {
  //         memoryImageUrl: input.memoryImageUrl,
  //         description: input.description,
  //         location: input.location,
  //         user: {
  //           connect: {
  //             id: user?.id,
  //           },
  //         },
  //       },
  //     });
  //     return memory;
  //   }),

  deleteMemory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session?.user;
      const memory = await ctx.prisma.memory.delete({
        where: {
          id: input.id,
        },
      });
      return memory;
    }),

  getUserMemories: protectedProcedure.query(async ({ ctx }) => {
    const memories = await ctx.prisma.memory.findMany({
      where: {
        userId: ctx.session?.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return memories;
  }),
});
