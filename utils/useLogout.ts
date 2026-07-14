"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg, errorMsg } from "@/utils/notify";
import { useQueryClient } from "@tanstack/react-query";

export default function useLogout() {
  // const queryClient = useQueryClient();
  const router = useRouter();
  // const mutation = useApiMutation();

  const logout = async () => {
    // try {
    //   await mutation.mutateAsync({ endpoint: "auth/logout", method: "post" });
    try {
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      // queryClient.clear();
    } catch (e) {
      // ignore
    }
    successMsg("Logged out successfully");
    router.replace("/");
  };

  return {
    logout,
  };
}
