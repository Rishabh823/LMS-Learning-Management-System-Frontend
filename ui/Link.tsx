import NextLink from "next/link";
import React from "react";

export type AppLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  href: {
    pathname: string;
    query?: Record<string, string | number | undefined>;
  };
  /** remove text-decoration underline */
  noDecoration?: boolean;
  /** render like a button (applies button-like classes) */
  asButton?: boolean;
  /** simple color variants when used as button */
  buttonVariant?: "primary" | "ghost" | "danger";
};

export default function Link({
  href,
  noDecoration = false,
  asButton = false,
  buttonVariant = "primary",
  className = "",
  children,
  ...rest
}: AppLinkProps) {
  const base = asButton
    ? "inline-flex items-center px-5 py-1 rounded-3xl shadow-sm text-sm font-semibold text-white"
    : "text-sm";

  const variantClass = asButton
    ? buttonVariant === "primary"
      ? "bg-blue-300 hover:bg-blue-400"
      : buttonVariant === "danger"
        ? "bg-red-300 hover:bg-red-400"
        : "bg-transparent text-blue-600 hover:underline"
    : "";

  const decoClass = noDecoration && !asButton ? "no-underline" : "";

  const classes = `${base} ${variantClass} ${decoClass} ${className}`.trim();

  return (
    <NextLink href={href} className={classes} {...(rest as any)}>
      {children}
    </NextLink>
  );
}
