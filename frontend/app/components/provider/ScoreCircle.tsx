import { ScoreTier } from "@/app/lib/mock-marketplace";
import { cn } from "@/app/lib/utils";

interface ScoreCircleProps {
  score: number;
  tier: ScoreTier;
}

export function ScoreCircle({ score, tier }: ScoreCircleProps) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const tierColors = {
    BRONZE: "text-amber-700",
    SILVER: "text-gray-400",
    GOLD: "text-yellow-500",
    PLATINUM: "text-purple-500",
  };

  const strokeColors = {
    BRONZE: "stroke-amber-700",
    SILVER: "stroke-gray-400",
    GOLD: "stroke-yellow-500",
    PLATINUM: "stroke-purple-500",
  };

  return (
    <div className="relative flex items-center justify-center h-40 w-40">
      <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-100"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-1000 ease-out", strokeColors[tier])}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold text-gray-900">{score}</span>
        <span className={cn("text-xs font-semibold tracking-wider", tierColors[tier])}>
          {tier}
        </span>
      </div>
    </div>
  );
}
