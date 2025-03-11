// function to login with credntials

import { loginFormType } from "@/schema/zodSchema";
import { getAxiosErrorMessage } from "@/utils/functions";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

export const useHandleCredentialsLogin = () => {
  const router = useRouter();
  const handleCredentialsLogin: SubmitHandler<loginFormType> = async (data) => {
    console.log(data);
    try {
      const result = await signIn("credentials", {
        callbackUrl: "/jeopardy",
        redirect: false,
        email: data.email,
        password: data.password,
      });
      console.log(result);
      if (result?.ok) {
        console.log("success", result);
        // Manual redirect on success
        router.push("/jeopardy");
        toast.success("Login successful!");
        return;
      }
      if (result?.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error signing in", error);
      toast.error(getAxiosErrorMessage(error));
    }
  };
  return { handleCredentialsLogin };
};
