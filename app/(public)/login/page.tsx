"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  // const searchParams = useSearchParams();
  // const error = searchParams.get("error");

  const handleLogin = async () => {
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

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2>Login</h2>
      <Button onClick={handleLogin}>Sign in with Google</Button>
    </div>
  );
}
