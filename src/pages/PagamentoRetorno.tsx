import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/backend";
import { CheckCircle2, XCircle, Loader2, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type CallbackStatus = "loading" | "success" | "error";

const PagamentoRetorno = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const processCallback = async () => {
      const params: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      if (Object.keys(params).length === 0) {
        setStatus("error");
        setMessage("Nenhum parâmetro de retorno recebido.");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("masterpass-callback", {
          body: params,
        });

        if (error) throw error;

        if (data?.success) {
          setStatus("success");
          setMessage(data.message || "Pagamento confirmado com sucesso!");
        } else {
          setStatus("error");
          setMessage(data?.message || "Não foi possível confirmar o pagamento.");
        }
      } catch (err: any) {
        console.error("Callback error:", err);
        setStatus("error");
        setMessage("Erro ao processar o retorno do pagamento. Tente novamente.");
      }
    };

    processCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center space-y-6">
        {status === "loading" && (
          <>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-foreground">Processando pagamento...</h1>
              <p className="text-sm text-muted-foreground">Aguarde enquanto confirmamos seu pagamento.</p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-foreground">Pagamento confirmado!</h1>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
            <Button className="w-full" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-foreground">Erro no pagamento</h1>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Tentar novamente
              </Button>
              <Button className="w-full" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao início
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PagamentoRetorno;
