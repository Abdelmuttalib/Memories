import Layout from "@/components/layout/Layout";
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";
import type { Session } from "next-auth";

interface ProfilePageProps {
  userSession: Session;
}

const ProfilePage = ({ userSession }: ProfilePageProps) => {
  return (
    <Layout>
      <main className="container w-full">
        <div className="flex w-full justify-between py-6">
          <h1 className="text-4xl font-bold">Profile</h1>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-medium">{userSession.user?.name}</h1>
          <p className="text-gray-500">{userSession.user?.email}</p>
        </div>
      </main>
    </Layout>
  );
};

export default ProfilePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userSession = await getServerAuthSession(context);

  // if (!userSession) {
  //   return {
  //     redirect: {
  //       destination: "/auth/sign-in",
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

  return {
    props: {
      userSession,
    },
  };
};
