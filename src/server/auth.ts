/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
// import { env } from "@/env.mjs";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/server/db";
import { comparePasswords } from "@/utils/bcrypt";
import { SupabaseAdapter } from "@auth/supabase-adapter";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      email_verified: boolean;
      image?: string;
      password: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    email_verified: boolean;
    image?: string;
    password: string;
    username: string;
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  image?: string;
  password: string;
  username: string;
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user }) {
      return {
        ...token,
        ...(user && user.id ? { id: user.id } : {}),
        ...(user && user.username ? { username: user.username } : {}),
        ...(user && user.email_verified
          ? { email_verified: user.email_verified }
          : {}),
      };
    },
    session: ({ session, token, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          // id: user.id,
          ...token,
          ...(token && token.id ? { id: token.id } : {}),
          ...(token && token.username ? { username: token.username } : {}),
          ...(token && token.email_verified
            ? { email_verified: token.email_verified }
            : {}),
        },
      };
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  // adapter: SupabaseAdapter({
  //   url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  // }),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "aud@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ): Promise<User | null> {

        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (user && credentials?.password) {
          const isPasswordValid = await comparePasswords(
            credentials?.password,
            user.password
          );

          if (isPasswordValid) {
            // Any object returned will be saved in `user` property of the JWT
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return user;
          }
        } else {
          // If you return null or false then the credentials will be rejected
          return null;
          // You can also Reject this callback with an Error or with a URL:
          // throw new Error('error message') // Redirect to error page
          // throw '/path/to/redirect'        // Redirect to a URL
        }

        return null;
      },
    }),
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
