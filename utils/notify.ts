import { toast } from "sonner";

type ToastMessage = string | number | null | undefined;

export function successMsg(
  msg: ToastMessage,
): ReturnType<typeof toast.success> {
  return toast.success(String(msg ?? ""), {
    className: "text-white border-transparent shadow-md px-4 py-2 rounded",
    style: { backgroundColor: "#009900", color: "#ffffff" },
  });
}

export function errorMsg(msg: ToastMessage): ReturnType<typeof toast.error> {
  return toast.error(String(msg ?? ""), {
    className: "text-white border-transparent shadow-md px-4 py-2 rounded",
    style: { backgroundColor: "#cc0000", color: "#ffffff" },
  });
}
