"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { errorMsg, successMsg } from "@/utils/notify";
import { forgotPasswordSchema } from "../schema/forgotPassword.schema";

export const useForgotPassword = () => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      errorMsg(result.error.issues[0]?.message || "Please check your details.");
      return;
    }

    // NOTE: no reset-password endpoint has been provided yet, so this is a
    // UI-only confirmation state rather than a real API call.
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setSubmitted(true);
      successMsg("Reset link sent! Please check your email.");
    }, 600);
  };

  return {
    submitted,
    isPending,
    handleSubmit,
    goToLogin: () => router.push("/auth/login"),
  };
};
