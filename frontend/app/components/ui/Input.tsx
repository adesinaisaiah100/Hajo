import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-medium text-foreground">{label}</span>
      ) : null}
      <input
        className={`w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-[#8a8278] focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[rgba(29,107,82,0.12)] ${className}`}
        {...props}
      />
    </label>
  );
}