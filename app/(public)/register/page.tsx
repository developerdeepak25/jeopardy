"use client";
import React from "react";
import { InputWithLabel } from "@/components/Inputs/InputWithLabel";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  registerFormType,
  registerSchema,
} from "@/schema/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import FormWrapper from "@/components/common/FormWrapper";
import { getAxiosErrorMessage } from "@/utils/functions";
import { useHandleCredentialsLogin } from "@/hooks";
import Link from "next/link";
// import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registerFormType>({
    resolver: zodResolver(registerSchema),
  });
  const { handleCredentialsLogin } = useHandleCredentialsLogin();

  // const handlerCredentialsLogin: SubmitHandler<loginFormType> = async (
  //   data
  // ) => {
  //   console.log(data);
  //   try {
  //     const result = await signIn("credentials", {
  //       callbackUrl: "/jeopardy",
  //       redirect: false,
  //       email: data.email,
  //       password: data.password,
  //     });
  //     console.log(result);
  //     if (result?.ok) {
  //       console.log("success", result);
  //       // Manual redirect on success
  //       router.push("/jeopardy");
  //       // or window.location.href = "/jeopardy";
  //       return;
  //     }
  //     if (result?.error) {
  //       toast.error(result.error);
  //     }
  //   } catch (error) {
  //     console.error("Error signing in", error);
  //     //
  //   }
  // };

  const onSubmit: SubmitHandler<registerFormType> = async (data) => {
    try {
      const res = await axios.post("/api/user/register", data);
      if (res.status !== 200) {
        // toast.error("Registration failed. Please try again.");
        const errMsg = getAxiosErrorMessage(res);
        toast.error(errMsg);
        return;
      }
      handleCredentialsLogin(data);

      // router.push("/login");
      toast.success("Registration successful!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(getAxiosErrorMessage(error));
      // toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center h-full w-full">
      <div className="container p-4 bg-white h-full flex items-center justify-center">
        <FormWrapper title="Register">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full min-w-sm "
          >
            <InputWithLabel
              label="Full Name"
              {...register("name")}
              error={errors.name}
            />
            <InputWithLabel
              label="Email Address"
              {...register("email")}
              error={errors.email}
            />
            <InputWithLabel
              label="Password"
              type="password"
              {...register("password")}
              error={errors.password}
            />
            <div className="flex flex-col">
              <Button type="submit" disabled={isSubmitting}>
                Register
              </Button>
              <p className="mt-2 text-end">
                Already a user?{" "}
                <Link href="/login" className="text-blue-600">
                  Login here.
                </Link>
              </p>
            </div>
          </form>
        </FormWrapper>
      </div>
    </div>
  );
};

export default RegisterPage;
