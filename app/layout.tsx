import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import NotificationsProvider from "@/providers/NotificationsProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "LMS - Awareness Management System",
  description:
    "A Learning Management System (LMS) designed to facilitate awareness and training programs within organizations. It provides a platform for creating, managing, and delivering educational content to employees, ensuring they stay informed and compliant with company policies and industry standards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          <NotificationsProvider>{children}</NotificationsProvider>
          <Toaster richColors position="top-right" />
        </ReactQueryProvider>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
