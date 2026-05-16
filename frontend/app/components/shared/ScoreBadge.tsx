import { cn } from "@/app/lib/utils";
import type { ScoreTier } from "@/app/lib/mock-marketplace";

const tierClasses: Record<ScoreTier, string> = {
  BRONZE: "bg-[#fed7aa] text-[#92400e]",
  SILVER: "bg-[var(--color-surface)] text-[var(--foreground)]",
  GOLD: "bg-[#fef08a] text-[#a16207]",
  PLATINUM: "bg-[#dbeafe] text-[#1e40af]",
};

export function ScoreBadge({ tier }: { tier: ScoreTier }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        tierClasses[tier],
      )}
    >
      {tier} Tier
    </span>
  );
}
