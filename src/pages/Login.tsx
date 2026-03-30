import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAthlete, saveAthlete } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy } from "lucide-react";

const positions = ["Goleiro", "Zagueiro", "Lateral", "Volante", "Meia", "Ponta", "Centroavante"];

const Login = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !position || !age) return;
    const athlete = createAthlete(name, email, position, parseInt(age));
    saveAthlete(athlete);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen gradient-field flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 mb-4 animate-pulse-glow">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">
            <span className="text-gradient">Pro Futebol</span>{" "}
            <span className="text-foreground">SM</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">Sua evolução começa aqui</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome completo</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="bg-muted/50 border-border/50 focus:border-primary h-12"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="bg-muted/50 border-border/50 focus:border-primary h-12"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Posição</label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="bg-muted/50 border-border/50 h-12">
                <SelectValue placeholder="Selecione sua posição" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((pos) => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Idade</label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="18"
              min={10}
              max={50}
              className="bg-muted/50 border-border/50 focus:border-primary h-12"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg font-heading font-bold bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mt-6"
          >
            ⚽ Entrar no vestiário
          </Button>
        </form>

        <p className="text-center text-muted-foreground text-xs mt-6">
          Treine como profissional. Evolua como campeão.
        </p>
      </div>
    </div>
  );
};

export default Login;
