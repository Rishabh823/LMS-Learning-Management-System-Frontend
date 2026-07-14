import { errorMsg } from "@/utils/notify";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const openRazorpayCheckout = (options: {
  orderId: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  prefillName?: string;
  prefillEmail?: string;
  prefillContact?: string;
  onSuccess: (result: RazorpayResult) => void;
  onDismiss: () => void;
}) => {
  if (typeof window === "undefined" || !window.Razorpay) {
    errorMsg("Payment gateway is still loading. Please try again in a moment.");
    options.onDismiss();
    return;
  }

  // Without a real order_id, Razorpay opens in "amount only" mode and its
  // success callback comes back with no razorpay_order_id/razorpay_signature
  // at all — which then fails verification with a confusing "signature is
  // required" error from the backend. Failing fast here, with a message that
  // points at the actual cause, is far easier to debug than that.
  if (!options.orderId) {
    errorMsg("Could not start payment: missing order id from the server.");
    options.onDismiss();
    return;
  }

  const rzp = new window.Razorpay({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: options.amount,
    currency: options.currency,
    name: options.name || "ZenithLMS",
    description: options.description || "Subscription payment",
    order_id: options.orderId,
    prefill: {
      name: options.prefillName,
      email: options.prefillEmail,
      contact: options.prefillContact,
    },
    theme: { color: "#0284c7" },
    handler: (response: RazorpayResult) => options.onSuccess(response),
    modal: {
      ondismiss: options.onDismiss,
    },
  });

  rzp.on("payment.failed", () => {
    errorMsg("Payment failed. Please try again.");
    options.onDismiss();
  });

  rzp.open();
};
