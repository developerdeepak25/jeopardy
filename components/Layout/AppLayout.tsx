'use client';
import React from "react";
import Navbar from "./Navbar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex w-full h-full flex-col">
        <Navbar />
        <div className="grow overflow-y-auto">{children}</div>
      </div>
    </>
  );
};

export default AppLayout;
