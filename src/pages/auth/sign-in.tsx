import AuthFormContainer from "@/components/auth/AuthFormContainer";
import Layout from "@/components/layout/Layout";
import BlurImage from "@/components/ui/blur-image";
import { Button, buttonVariants } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { cn } from "@/utils/cn";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getProviders, signIn } from "next-auth/react";

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
      <div className="container relative hidden h-[100svh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Button
          variant="ghost"
          size="sm"
          className={cn("absolute right-4 top-4 md:right-8 md:top-8")}
        >
          Login
        </Button>
        <div className="relative hidden h-full flex-col bg-black text-white lg:flex">
          <div className="relative h-full w-full">
            <BlurImage
              src="https://images.unsplash.com/photo-1479556234618-efd55bac0a26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1161&q=80"
              alt="two women taking selfie"
              layout="fill"
              objectFit="cover"
              quality={100}
              className="bg-red-300 opacity-50"
              // onLoadingComplete={(image) => console.log("oo: ", image)}
            />
          </div>
          <div className="absolute inset-0 bg-black opacity-60" />
          <div className="absolute top-8 z-20 flex items-center text-lg font-bold">
            MEMORIES
          </div>
          <div className="absolute bottom-8 z-20 mt-auto">
            <blockquote>
              <p className="text-lg text-gray-400">
                &ldquo;Share Life&apos;s Treasured Moments with the World.
                Embrace the beauty of heartfelt stories, combined with
                captivating photos, to create lasting impressions.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>

        <div className="lg:p-8">
          <AuthFormContainer />
        </div>
      </div>
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

  // if (userSession) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };

  const authProviders = await getProviders();

  return {
    props: {
      providers: authProviders,
    },
  };
};
