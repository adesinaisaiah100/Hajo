import type { ReactNode } from "react";

export function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 border-b border-[#f3f4f6] pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
          {description ? <p className="mt-1 text-sm text-[#6b7280]">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}
