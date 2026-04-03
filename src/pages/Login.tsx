import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/backend";
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,hsl(145_65%_42%/0.08),transparent)]" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/15 mb-5">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold tracking-tight mb-2">
            {isSignUp ? (
              <>Comece sua evolução com mais <span className="text-gradient">direção</span></>
            ) : (
              <>Volte para sua <span className="text-gradient">rotina</span></>
            )}
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            {isSignUp
              ? "Monte sua base no app e organize sua rotina como atleta."
              : "Acesse seu painel e continue sua evolução."}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-surface-2 rounded-xl p-1 mb-6">
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${isSignUp ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Cadastro
          </button>
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${!isSignUp ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
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
                className="bg-surface-2 border-border/50 focus:border-primary h-12"
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
              className="bg-surface-2 border-border/50 focus:border-primary h-12"
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
                className="bg-surface-2 border-border/50 focus:border-primary h-12 pr-10"
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
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Posição em campo</label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger className="bg-surface-2 border-border/50 h-12">
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
                    className="bg-surface-2 border-border/50 focus:border-primary h-12"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Objetivo</label>
                  <Input
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="Ser titular"
                    className="bg-surface-2 border-border/50 focus:border-primary h-12"
                  />
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-base font-heading font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mt-6"
          >
            {loading ? "Carregando..." : isSignUp ? "Criar minha conta" : "Acessar meu painel"}
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
              className="bg-surface-2 border-border/50 focus:border-primary h-12"
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
              className="w-full h-12"
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

        <p className="text-center text-muted-foreground/60 text-xs mt-8">
          Preparação não acontece no improviso.
        </p>
      </div>
    </div>
  );
};

export default Login;
