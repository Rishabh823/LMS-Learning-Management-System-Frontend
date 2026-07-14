"use client";

import { useRouter } from "next/navigation";
import Button from "@/ui/Button";

const AuthNav = () => {
  const router = useRouter();
  return (
    <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={() => router.push("/")}
      >
        <img
          src="/zenith%20guard%20transparent%20logo.png"
          alt="ZenithLMS"
          className="h-8 w-8 object-contain"
        />
        <span className="text-lg font-bold text-sky-600">ZenithLMS</span>
      </div>
      <Button variant="clear" onClick={() => router.push("/auth/login")}>
        Sign In
      </Button>
    </nav>
  );
};

export default AuthNav;
