/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession, signIn } from "next-auth/react";
import { type Dispatch, type FC, type SetStateAction, useState } from "react";
import { type TAuthType } from "./AuthFormContainer";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/router";
import { toast } from "sonner";
import Link from "next/link";

const signInValidationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "kindly enter your email" })
    .email({ message: "kindly enter a valid email" }),
  password: z.string().min(4),
});

type TSignInFormFields = z.infer<typeof signInValidationSchema>;

export default function SignInForm() {
  const { push } = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignInFormFields>({
    resolver: zodResolver(signInValidationSchema),
  });

  function onSignIn(data: TSignInFormFields) {
    setLoading(true);

    // sign in
    signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/feed",
      redirect: false,
      // callbackUrl: `${window.location.origin}/dashboard/projects`,
    })
      .then(async (response) => {
        if (response?.ok) {
          toast.success("Signed in successfully");
          await push(response?.url as string);
        }
        if (!response?.ok) {
          toast.error("Sign in failed");
        }
      })
      .catch((error) => {
        toast.error("Sign in failed");
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="w-full">
      {/* Card Title */}
      <h2 className="text-2xl font-bold lg:text-3xl">
        Sign in
        {/* to your account */}
      </h2>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(onSignIn)}
      >
        <div>
          {/* Email Input */}
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: true })}
            placeholder="email address"
            autoComplete="email"
            className={cn({ "border-red-500": errors.email })}
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email?.message}</p>
          )}
        </div>

        <div>
          {/* Password Input */}
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password", { required: true })}
            placeholder="password"
            autoComplete="current-password"
            className={cn({ "border-red-500": errors.password })}
            disabled={loading}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-500">
              {errors.password?.message}
            </p>
          )}
        </div>

        <div className="mt-2">
          {/* Auth Buttton */}
          <Button
            type="submit"
            className={cn("w-full")}
            disabled={Object.keys(errors).length > 0 || loading}
            isLoading={loading}
          >
            Sign In
          </Button>
          {/* <Button
            type="button"
            className={cn("w-full")}
            disabled={loading}
            variant="flat"
          >
            Create an account
          </Button> */}
        </div>
      </form>
    </div>
  );
}
