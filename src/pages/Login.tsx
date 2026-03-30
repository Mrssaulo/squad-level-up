import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const positions = ["Goleiro", "Zagueiro", "Lateral", "Volante", "Meia", "Ponta", "Centroavante"];

const Login = () => {
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [age, setAge] = useState("");
  const [objective, setObjective] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isSignUp && (!name || !position || !age)) {
      toast.error("Preencha todos os campos!");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, {
          name,
          position,
          age: parseInt(age),
          objective,
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Conta criada! Verifique seu email para confirmar.");
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error("Email ou senha incorretos");
          return;
        }
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
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
          <p className="text-muted-foreground mt-2 text-sm">
            {isSignUp ? "Crie sua conta e comece a evoluir" : "Bem-vindo de volta, atleta!"}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-muted/50 rounded-lg p-1 mb-6">
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${isSignUp ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Cadastro
          </button>
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${!isSignUp ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Login
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome completo</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="bg-muted/50 border-border/50 focus:border-primary h-12"
              />
            </div>
          )}

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
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="bg-muted/50 border-border/50 focus:border-primary h-12"
            />
          </div>

          {isSignUp && (
            <>
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

              <div className="grid grid-cols-2 gap-3">
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
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Objetivo</label>
                  <Input
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="Ser titular"
                    className="bg-muted/50 border-border/50 focus:border-primary h-12"
                  />
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-lg font-heading font-bold bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mt-6"
          >
            {loading ? "Carregando..." : isSignUp ? "⚽ Criar conta" : "⚽ Entrar no vestiário"}
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
