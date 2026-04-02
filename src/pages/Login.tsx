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
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

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
        toast.success("Conta criada! Verifique seu email para confirmar o cadastro.");
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
          <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="bg-muted/50 border-border/50 focus:border-primary h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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

        {!isSignUp && !forgotMode && (
          <button
            type="button"
            onClick={() => setForgotMode(true)}
            className="block w-full text-center text-primary text-sm mt-4 hover:underline"
          >
            Esqueci minha senha
          </button>
        )}

        {forgotMode && (
          <div className="mt-6 space-y-3 animate-fade-in">
            <p className="text-sm text-muted-foreground text-center">
              Digite seu email para receber o link de redefinição
            </p>
            <Input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="seu@email.com"
              className="bg-muted/50 border-border/50 focus:border-primary h-12"
            />
            <Button
              type="button"
              disabled={forgotLoading || !forgotEmail}
              onClick={async () => {
                setForgotLoading(true);
                const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
                  redirectTo: `${window.location.origin}/reset-password`,
                });
                setForgotLoading(false);
                if (error) {
                  toast.error(error.message);
                } else {
                  toast.success("Email de redefinição enviado! Verifique sua caixa de entrada.");
                  setForgotMode(false);
                }
              }}
              className="w-full h-12 bg-primary hover:bg-primary/90"
            >
              {forgotLoading ? "Enviando..." : "Enviar link de redefinição"}
            </Button>
            <button
              type="button"
              onClick={() => setForgotMode(false)}
              className="block w-full text-center text-muted-foreground text-xs hover:underline"
            >
              Voltar ao login
            </button>
          </div>
        )}

        <p className="text-center text-muted-foreground text-xs mt-6">
          Treine como profissional. Evolua como campeão.
        </p>
      </div>
    </div>
  );
};

export default Login;
