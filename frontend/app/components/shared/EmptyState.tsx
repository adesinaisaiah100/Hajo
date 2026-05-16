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
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[var(--color-line)] bg-[var(--color-surface)] p-12 text-center">
      <Icon className="h-12 w-12 text-[var(--color-ink-muted)]" strokeWidth={1.5} />
      <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--color-ink-muted)]">{description}</p>
    </div>
  );
}
