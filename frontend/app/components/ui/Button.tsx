import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  isLoading?: boolean;
  className?: string;
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  ...props
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
    variant === "primary" &&
      "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-strong)]",
    variant === "secondary" &&
      "border border-[var(--color-line)] bg-white text-[var(--color-brand-strong)] hover:bg-[#f4efe7]",
    variant === "ghost" &&
      "bg-transparent text-[var(--color-brand-strong)] hover:bg-white/70",
    size === "lg" ? "px-6 py-3.5 text-base" : "px-5 py-3 text-sm",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>;
  }

  return (
    <button className={classes} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? "Please wait..." : children}
    </button>
  );
}