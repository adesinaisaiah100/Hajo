import { cn } from "@/app/lib/utils";
import type { ScoreTier } from "@/app/lib/mock-marketplace";

const tierClasses: Record<ScoreTier, string> = {
  BRONZE: "bg-[#fef3c7] text-[#92400e]",
  SILVER: "bg-[#f3f4f6] text-[#4b5563]",
  GOLD: "bg-[#fef3c7] text-[#b45309]",
  PLATINUM: "bg-[#eef2ff] text-[#4338ca]",
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
