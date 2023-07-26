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

function CreateAccountForm({
  setAuthType,
}: {
  setAuthType: Dispatch<SetStateAction<TAuthType>>;
}) {
  const signUpValidationSchema = z
    .object({
      email: z
        .string()
        .min(1, { message: "kindly enter your email" })
        .email({ message: "kindly enter a valid email" }),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignUpFormFields>({
    resolver: zodResolver(signUpValidationSchema),
  });
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
  async function onSubmit(data: TSignUpFormFields) {
    console.log(data);
    const { email, password } = data;

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const responseData = await response.json();
      // Handle the response data
      console.log("Registration successful:", responseData);
      // toast.success("User created successfully");
      setAuthType("sign-in");
    } catch (error) {
      // Handle the error
      console.error("Registration error:", error);
    }

    // const res = await prismaClient.user.create({
    //   data: {
    //     email: data.email,
    //     password: data.password,
    //   },
    // });
    // console.log(res);

    // createUserMutation.mutate({
    //   email: data.email,
    //   password: data.password,
    // });
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
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: true })}
            placeholder="e-mail address"
            autoComplete="email"
            className={cn({ "border-red-500": errors.email })}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email?.message}</p>
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
            className={cn({ "border-red-500": errors.password })}
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
            className={cn({ "border-red-500": errors.confirmPassword })}
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
            disabled={Object.keys(errors).length > 0}
            className={cn("w-full")}
          >
            Create Account
          </Button>

          <Button
            type="button"
            onClick={() => setAuthType("sign-in")}
            className={cn("w-full")}
            variant="outline"
          >
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateAccountForm;
