"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useApiMutation } from "@/services/useApiMutation";
import { errorMsg, successMsg } from "@/utils/notify";
import {
  setAuthToken,
  setOrgId,
  setRole,
  setUserId,
} from "@/utils/cookieManager";
import { loginSchema } from "../schema/login.schema";
import { LOGIN_ENDPOINT } from "../api/login.api";
import type { LoginPayload, LoginResponse } from "../types/login.types";

const CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const generateCaptcha = () =>
  Array.from(
    { length: 5 },
    () => CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)],
  ).join("");

export const useLogin = () => {
  const router = useRouter();
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const { mutate, isPending } = useApiMutation();

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (captchaInput.trim() !== captcha) {
      errorMsg("Security code does not match. Please try again.");
      refreshCaptcha();
      return;
    }

    const form = e.currentTarget;
    const payload: LoginPayload = {
      emailId: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };

    const result = loginSchema.safeParse(payload);
    if (!result.success) {
      errorMsg(result.error.issues[0]?.message || "Please check your details.");
      return;
    }

    mutate(
      {
        method: "post",
        endpoint: LOGIN_ENDPOINT,
        body: result.data,
      },
      {
        onSuccess: (data: LoginResponse) => {
          if (data?.token) setAuthToken(data.token);
          if (data?.role) setRole(data.role);
          if (data?.organizationId != null) {
            setOrgId(String(data.organizationId));
          }
          if (data?.userId != null) {
            setUserId(String(data.userId));
          }
          successMsg(data?.message || "Signed in successfully.");
          router.push("/dashboard");
        },
        onError: () => {
          refreshCaptcha();
        },
      },
    );
  };

  return {
    captcha,
    captchaInput,
    setCaptchaInput,
    refreshCaptcha,
    handleLogin,
    isPending,
  };
};
