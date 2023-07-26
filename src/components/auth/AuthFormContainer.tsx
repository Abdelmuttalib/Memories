import React, { useState } from "react";
import SignInForm from "./SignInForm";
import CreateAccountForm from "./CreateAccountForm";
import { useSession } from "next-auth/react";

export type TAuthType = "sign-in" | "create-account";

const AuthFormContainer = () => {
  const { data, status } = useSession();
  console.log("data: ", data, "status: ", status);
  const [authType, setAuthType] = useState<TAuthType>("sign-in");
  return (
    <div className="mx-auto flex h-full w-full max-w-lg flex-col items-center justify-center gap-4 rounded-r-lg px-6 py-10 sm:px-20 sm:py-20">
      {authType === "sign-in" ? (
        <SignInForm setAuthType={setAuthType} />
      ) : (
        <CreateAccountForm setAuthType={setAuthType} />
      )}
      {/* <div className="flex w-full items-center gap-4">
        <hr className="w-full border" />
        <p>or</p>
        <hr className="w-full border" />
      </div>
      <div className="flex w-full flex-col justify-between gap-2">
        <Button
          variant="outline"
          className="inline-flex w-full gap-2 transition duration-150"
        >
          <Image
            width="20"
            height="20"
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google logo"
          />

          <span>Sign in with Google</span>
        </Button>
        <Button
          variant="outline"
          className="inline-flex w-full gap-2 transition duration-150"
        >
          <Image
            width="20"
            height="20"
            src="https://www.svgrepo.com/show/512317/github-142.svg"
            alt="github logo"
          />
          <span>Sign in with Github</span>
        </Button>
      </div> */}
    </div>
  );
};

export default AuthFormContainer;
