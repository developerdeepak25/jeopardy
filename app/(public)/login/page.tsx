"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginFormType, loginSchema } from "@/schema/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

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
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2>Login</h2>
      <form
        onSubmit={handleSubmit(handlerCredentialsLogin)}
        className="flex flex-col "
      >
        <Input placeholder="Email" {...register("email")} />
        <Input placeholder="Password" {...register("password")} />
        {errors && <p>{errors.root?.message}</p>}
        <Button type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </form>
      <Button onClick={handleGoogleLogin}>Sign in with Google</Button>
    </div>
  );
}
