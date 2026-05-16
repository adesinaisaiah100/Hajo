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
    <section className="rounded-lg border border-[var(--color-line)] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-[var(--color-line)] pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
          {description ? <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}
