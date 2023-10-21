/* eslint-disable @typescript-eslint/no-unused-vars */
// import Layout from "@/components/layout/Layout";
import BlurImage from "@/components/ui/blur-image";

import { getServerAuthSession } from "@/server/auth";
import { cn } from "@/utils/cn";
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
  type NextPage,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import CreateAccountForm from "@/components/auth/CreateAccountForm";
import { Button } from "@/components/ui/button";
import LoginLayout from "@/components/layout/LoginLayout";

// type TProvider = {
//   callbackUrl: string;
//   id: string;
//   name: string;
//   signinUrl: string;
//   type: string;
// };

const SignInPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  return (
    <>
      <LoginLayout>
        <CreateAccountForm />
      </LoginLayout>
    </>
  );
};

{
  /* <button onClick={handleGitHubSignIn}>Sign in with GitHub</button> */
}
{
  /* {Object.values(providers).map((provider) => (
        <Button
          key={provider.id}
          type="button"
          onClick={() => signIn(provider.name.toLowerCase() as string)}
        >
          {provider.name}
        </Button>
      ))} */
}

export default SignInPage;

export const getServerSideProps: GetServerSideProps<{
  providers: unknown;
}> = async (context) => {
  const userSession = await getServerAuthSession(context);

  if (userSession) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const authProviders = await getProviders();

  return {
    props: {
      providers: authProviders,
    },
  };
};
