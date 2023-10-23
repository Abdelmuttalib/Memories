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
        likes: true,
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
        likes: true,
      },
    });
    return memories;
  }),

  // likes/memory likes

  //   model Memory {
  //     id             String @id @default(uuid())
  //     description    String
  //     memoryImageUrl String

  //     createdAt DateTime     @default(now())
  //     location  String?
  //     likes     MemoryLike[]

  //     userId String // Add this foreign key field
  //     user   User   @relation(fields: [userId], references: [id])

  //     @@map(name: "memories")
  // }

  // model MemoryLike {
  //     id       String @id @default(uuid())
  //     memory   Memory @relation(fields: [memoryId], references: [id])
  //     memoryId String
  //     user     User   @relation(fields: [userId], references: [id])
  //     userId   String

  //     @@unique([memoryId, userId])
  // }

  likeMemory: protectedProcedure
    .input(z.object({ memoryId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session?.user;
      const userId = user?.id;
      const { memoryId } = input;

      // Check if the user has already liked this memory
      const existingLike = await ctx.prisma.memoryLike.findUnique({
        where: {
          memoryId_userId: {
            memoryId,
            userId,
          },
        },
      });

      if (existingLike) {
        throw new Error("User already likes this memory");
      }

      const likeMemory = await ctx.prisma.memoryLike.create({
        data: {
          memoryId,
          userId,
        },
      });

      const memory = await ctx.prisma.memory.update({
        where: {
          id: memoryId,
        },
        data: {
          likes: {
            connect: {
              id: likeMemory.id,
            },
          },
        },
      });

      return { likeMemory, memory };
    }),

  unlikeMemory: protectedProcedure
    .input(z.object({ memoryId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session?.user;
      const userId = user?.id;
      const { memoryId } = input;

      // Check if the user has already liked this memory
      const existingLike = await ctx.prisma.memoryLike.findUnique({
        where: {
          memoryId_userId: {
            memoryId,
            userId,
          },
        },
      });

      if (!existingLike) {
        throw new Error("User has not liked this memory");
      }

      // const memory = await ctx.prisma.memory.update({
      //   where: {
      //     id: memoryId,
      //   },
      //   data: {
      //     likes: {
      //       disconnect: {
      //         id: existingLike.id,
      //       },
      //     },
      //   },
      // });

      const likeMemory = await ctx.prisma.memoryLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      return { likeMemory };
    }),

  countMemoryLikes: protectedProcedure
    .input(
      z.object({
        memoryId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { memoryId } = input;
      // Attempt to retrieve the like count from cache
      // const cachedCount = await cache.getMemoryLikeCount(memoryId);

      // if (cachedCount !== undefined) {
      //   return cachedCount;
      // }

      // If not cached, fetch and cache the like count
      const likesCount = await ctx.prisma.memoryLike.count({
        where: { memoryId },
      });

      // await cache.setMemoryLikeCount(memoryId, likeCount);

      return likesCount;
    }),
});
