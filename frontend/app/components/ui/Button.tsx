import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
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
  const baseClasses = [
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand)]",
    "disabled:cursor-not-allowed disabled:opacity-60 disabled:pointer-events-none",
  ].join(" ");

  const variantClasses = {
    primary: "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-strong)] active:scale-95 shadow-card hover:shadow-hover",
    secondary: "bg-white text-[var(--foreground)] border-2 border-[var(--color-line)] hover:border-[var(--color-brand)] hover:bg-[var(--color-surface)] active:scale-95",
    ghost: "text-[var(--color-brand)] hover:bg-[var(--color-surface)] active:scale-95",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-3 text-base",
    lg: "px-6 py-3.5 text-lg",
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}