"use client";
import { useSession, signOut } from "next-auth/react";
// import useStore from "@/store/st/ore";
// import { NavLink } from "react-router-dom";

import { Button } from "../ui/button";
import NavLink from "../Navlink";
import Link from "next/link";

// type Link = {
//   name: string;
//   path: string;
// };

// const links = [
//   {
//     name: "Admin",
//     path: "/admin",
//   },
//   {
//     name: "Login",
//     path: "/login",
//   },
// ];

// const Navbar = ({ links }: { links: Link[] }) => {
const Navbar = () => {
  //   const { auth } = useStore();
  //   console.log(auth);
  const { data: session } = useSession();

  return (
    <nav
      className="bg-background border-b h-16 flex items-center shrink-0"
      aria-label="Main navigation"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center" aria-label="SmartSend logo">
          <span className="text-lg font-semibold">
            <Link href="/">Logo</Link>
          </span>
        </div>
        <div className="flex gap-4 items-center">
          {/* contact is public route */}
          <NavLink href="/contact">contact</NavLink>
          {session ? (
            <>
              <NavLink href="/leaderboard">Leaderboard</NavLink>
              <NavLink href="/jeopardy">Play</NavLink>
              <Button className="cursor-pointer" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <NavLink className="text-white hover:text-white" href="/login">
              <Button className="cursor-pointer text-white">login</Button>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
