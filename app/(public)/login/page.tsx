"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2>Login</h2>
      <Button onClick={() => signIn("google", { callbackUrl: "/jeopardy" })}>
        Sign in with Google
      </Button>
    </div>
  );
}
