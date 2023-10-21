import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { hashPassword } from "@/utils/bcrypt";

export const userRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        username: z.string(),
        name: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = await hashPassword(input.password);
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          username: input.username,
          name: input.name,
          password: hashedPassword,
        },
      });
      return user;
    }),

  getUserProfileData: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user?.id,
      },
    });
    return user;
  }),

  updateUserProfileData: protectedProcedure
    .input(
      z.object({
        image: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user?.id,
        },
        data: {
          image: input.image,
          name: input.name,
        },
      });
      return user;
    }),

  updateUserProfileImage: protectedProcedure
    .input(
      z.object({
        image: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user?.id,
        },
        data: {
          image: input.image,
        },
      });
      return user;
    }),
});
