import { useLocation, useNavigate } from "react-router-dom";
import { Home, Dumbbell, User, Brain, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", label: "Início", icon: Home, tourId: "nav-home" },
  { path: "/treinos", label: "Treinos", icon: Dumbbell, tourId: "nav-treinos" },
  { path: "/ranking", label: "Ranking", icon: Trophy, tourId: "nav-ranking" },
  { path: "/personal", label: "Coach IA", icon: Brain, tourId: "nav-coach" },
  { path: "/avaliacao", label: "Perfil", icon: User, tourId: "nav-perfil" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/30">
      <div className="flex items-center justify-around max-w-md mx-auto h-16">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 relative",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground hover:scale-105"
              )}
            >
              {active && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
              )}
              <div className={cn(
                "transition-all duration-200",
                active && "scale-110"
              )}>
                <Icon className={cn(
                  "w-5 h-5",
                  active && "drop-shadow-[0_0_8px_hsl(var(--primary))]"
                )} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all",
                active && "font-bold"
              )}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
