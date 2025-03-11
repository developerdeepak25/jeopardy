"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginFormType, loginSchema } from "@/schema/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import AuthPageWrapper from "@/components/common/AuthPageWrapper";
import FormWrapper from "@/components/common/FormWrapper";
import GoogleLogo from "@/assets/GoogleLogo";
import { getAxiosErrorMessage } from "@/utils/functions";
import { toast } from "sonner";
import { useHandleCredentialsLogin } from "@/hooks";
import { InputWithLabel } from "@/components/Inputs/InputWithLabel";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginFormType>({
    resolver: zodResolver(loginSchema),
  });
  const { handleCredentialsLogin } = useHandleCredentialsLogin();

  const handleGoogleLogin = async () => {
    try {
      const result = await signIn("google", {
        callbackUrl: "/jeopardy",
        redirect: false,
      });
      //TODO: try without redirect: false
      console.log(result);
      if (result?.error) {
        console.log("error", result.error);
        
      }
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  return (
    <AuthPageWrapper>
      <FormWrapper title="Login to Jeopardy">
        <form
          onSubmit={handleSubmit(handleCredentialsLogin)}
          className="flex flex-col gap-4 w-full min-w-sm"
        >
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
          {/* {errors.root && <p>{errors.root?.message}</p>} */}
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline self-end"
          >
            forgot-password?
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </form>
        <p className="text-center my-1">or</p>
        <div className="flex flex-col items-end">
          <Button onClick={handleGoogleLogin} className="shrink-0 w-full">
            <GoogleLogo />
            Sign in with Google
          </Button>
          <p className="mt-2">
            dont have an account?{" "}
            <Link href="/register" className="text-blue-600">
              register here.
            </Link>
          </p>
        </div>
      </FormWrapper>
    </AuthPageWrapper>
  );
}
