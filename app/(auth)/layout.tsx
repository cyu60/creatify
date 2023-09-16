import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center h-full flex-col">
      <div>{children}</div>
    </div>
  );
};

export default AuthLayout;
