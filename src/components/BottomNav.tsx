import { useLocation, useNavigate } from "react-router-dom";
import { Home, Dumbbell, User, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", label: "Início", icon: Home },
  { path: "/treinos", label: "Treinos", icon: Dumbbell },
  { path: "/personal", label: "Coach IA", icon: Brain },
  { path: "/avaliacao", label: "Perfil", icon: User },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/50">
      <div className="flex items-center justify-around max-w-md mx-auto h-16">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-all duration-200",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", active && "drop-shadow-[0_0_8px_hsl(var(--primary))]")} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
