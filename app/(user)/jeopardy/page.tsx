"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }
  console.log("session", session);

  return (
    <div>
      <h2>Welcome, {session.user?.name}</h2>
      <p>Email: {session.user?.email}</p>
      <p>Role: {session.user?.role}</p>
      <Button onClick={() => signOut()}>Logout</Button>
    </div>
  );
}
