import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#d1d5db] bg-white p-12 text-center">
      <Icon className="h-14 w-14 text-[#d1d5db]" strokeWidth={1.3} />
      <h3 className="mt-5 text-lg font-semibold text-[#111827]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#6b7280]">{description}</p>
    </div>
  );
}
