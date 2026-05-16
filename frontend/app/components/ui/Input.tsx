import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-semibold text-[var(--foreground)]">{label}</span>
      ) : null}
      <input
        className={`w-full rounded-lg border-2 border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 ${className}`}
        {...props}
      />
    </label>
  );
}