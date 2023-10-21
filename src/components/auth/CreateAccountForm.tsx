/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TAuthType } from "./AuthFormContainer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import Link from "next/link";
import { AtSign } from "lucide-react";

const signUpValidationSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "kindly enter your email" })
      .email({ message: "kindly enter a valid email" }),
    name: z.string().min(1, { message: "kindly enter your name" }),
    username: z.string().min(1, { message: "kindly enter your username" }),
    password: z
      .string()
      .min(4, { message: "password must be at least 4 characters" }),
    confirmPassword: z
      .string()
      .min(4, { message: "password must be at least 4 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwords do not match",
  });

type TSignUpFormFields = z.infer<typeof signUpValidationSchema>;

export default function CreateAccountForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignUpFormFields>({
    resolver: zodResolver(signUpValidationSchema),
  });

  const { push } = useRouter();
  // const createMemoryMutation = api.memories.createMemory.useMutation({
  //   onSuccess: () => {
  //     toast.success("User created successfully");
  //     setAuthType("sign-in");
  //   },

  //   onError: (err) => {
  //     toast.error(err.message);
  //   },
  // });
  // console.log(createUserMutation);

  const registerUserMutation = api.user.registerUser.useMutation({
    onSuccess: async () => {
      toast.success("User created successfully");
      await push("/sign-in");
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  async function onSubmit(data: TSignUpFormFields) {
    const { email, username, name, password } = data;

    await registerUserMutation.mutateAsync({
      email,
      username,
      name,
      password,
    });
  }

  return (
    <div className="w-full">
      {/* Card Title */}
      <h2 className="text-2xl font-bold lg:text-3xl">Create an Account</h2>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Email Input */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: true })}
            placeholder="email address"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email?.message}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            {...register("name", { required: true })}
            placeholder="name"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name?.message}</p>
          )}
        </div>

        {/* Username */}
        {/* <AtSign className="absolute -bottom-0.5 left-2 w-5 -translate-y-1/2 transform text-ashgray-700" /> */}
        <div className="relative">
          <Label htmlFor="username">Username</Label>
          <div className="relative flex">
            <AtSign className="absolute bottom-2 left-2 w-5 text-ashgray-600" />
            <Input
              id="username"
              type="text"
              {...register("username", { required: true })}
              placeholder="username"
              className="pl-8"
            />
          </div>
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username?.message}</p>
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
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password?.message}</p>
          )}
        </div>

        <div>
          {/* Confirm Password Input */}
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", { required: true })}
            placeholder="confirm password"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword?.message}
            </p>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {/* Auth Buttton */}
          <Button
            type="submit"
            disabled={
              Object.keys(errors).length > 0 || registerUserMutation.isLoading
            }
            className={cn("w-full")}
            isLoading={registerUserMutation.isLoading}
          >
            Create Account
          </Button>
        </div>
      </form>
    </div>
  );
}
