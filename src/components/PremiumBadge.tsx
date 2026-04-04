import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

const PremiumBadge = ({ className, size = "sm" }: PremiumBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary font-semibold",
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1",
        className
      )}
    >
      <Crown className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      Premium
    </span>
  );
};

export default PremiumBadge;
