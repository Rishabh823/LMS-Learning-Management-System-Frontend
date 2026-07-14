import type { ReactNode } from "react";
import Bg from "./Bg";
import AuthNav from "./AuthNav";

const AuthWrap = ({
  children,
  wide,
}: {
  children: ReactNode;
  wide?: boolean;
}) => (
  <div className="relative flex h-screen flex-col overflow-hidden bg-linear-to-br from-sky-100 via-white to-sky-50">
    <Bg />
    <AuthNav />
    <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-6 py-6">
      <div className={wide ? "w-full max-w-4xl" : "w-full max-w-md"}>
        {children}
      </div>
    </div>
  </div>
);

export default AuthWrap;
