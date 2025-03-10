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

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginFormType>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();

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
        // const url = new URL(window.location.href);
        // url.searchParams.set("error", result?.error);
        // window.history.replaceState(null, "", url.toString()); // Update URL without reloading
        // window.history.replaceState(
        //   null,
        //   "",
        //   "/login?error=" + encodeURIComponent(result.error)
        // ); // Update URL
      }
    } catch (error) {
      console.error("Error signing in", error);
    }
  };
  const handlerCredentialsLogin: SubmitHandler<loginFormType> = async (
    data
  ) => {
    console.log(data);
    try {
      const result = await signIn("credentials", {
        callbackUrl: "/jeopardy",
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (result?.ok) {
        console.log("success", result);
        // Manual redirect on success
        router.push("/jeopardy");
        // or window.location.href = "/jeopardy";
      }
      console.log(result);
    } catch (error) {
      console.error("Error signing in", error);
      //
    }
  };

  return (
    <AuthPageWrapper>
      <FormWrapper title="Login to Jeopardy">
        <form
          onSubmit={handleSubmit(handlerCredentialsLogin)}
          className="flex flex-col gap-4 w-full min-w-sm"
        >
          <Input placeholder="Email" {...register("email")} />
          <Input placeholder="Password" {...register("password")} />
          {errors.root && <p>{errors.root?.message}</p>}
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
            don't have an account?{" "}
            <Link href="/register" className="text-blue-600">
              register here.
            </Link>
          </p>
        </div>
      </FormWrapper>
    </AuthPageWrapper>
  );
}
