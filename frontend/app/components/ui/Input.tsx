import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-semibold text-[#111827]">{label}</span>
      ) : null}
      <input
        className={`w-full rounded-lg border-2 border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition placeholder:text-[#d1d5db] focus:border-[#14b8a6] focus:ring-4 focus:ring-[rgba(20,184,166,0.1)] ${className}`}
        {...props}
      />
    </label>
  );
}