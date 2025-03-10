import React from "react";

const AuthPageWrapper = ({children}:{children:React.ReactNode}) => {
  return (
    <div className="flex justify-center h-full w-full">
      <div className="container p-4 bg-white h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthPageWrapper;
