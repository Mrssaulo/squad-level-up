import { useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UpgradePromptProps {
  title?: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

const UpgradePrompt = ({
  title = "Aprofunde sua evolução",
  description = "A versão premium libera uma rotina mais completa, com mais personalização, planejamento e acompanhamento.",
  className,
  compact = false,
}: UpgradePromptProps) => {
  const navigate = useNavigate();

  if (compact) {
    return (
      <div className={cn("rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-3", className)}>
        <Crown className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{title}</p>
          <p className="text-[11px] text-muted-foreground truncate">{description}</p>
        </div>
        <Button size="sm" variant="ghost" className="text-primary text-xs shrink-0" onClick={() => navigate("/planos")}>
          Ver Premium
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-5 space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Crown className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" onClick={() => navigate("/planos")}>
        Ver Premium
      </Button>
    </div>
  );
};

export default UpgradePrompt;
