import { useState, useCallback, lazy, Suspense, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import SplashScreen from "./components/SplashScreen";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const AuthShell = lazy(() => import("./components/AuthShell"));
const Login = lazy(() => import("./pages/Login"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Treinos = lazy(() => import("./pages/Treinos"));
const Avaliacao = lazy(() => import("./pages/Avaliacao"));
const PersonalTrainer = lazy(() => import("./pages/PersonalTrainer"));
const ActiveTraining = lazy(() => import("./pages/ActiveTraining"));
const TrainingComplete = lazy(() => import("./pages/TrainingComplete"));
const Historico = lazy(() => import("./pages/Historico"));
const Calendario = lazy(() => import("./pages/Calendario"));
const Ranking = lazy(() => import("./pages/Ranking"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const hasBackendConfig = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const BackendUnavailablePage = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-background p-6">
    <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-2xl">
        ⚠️
      </div>
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Área interna</p>
        <h1 className="text-xl font-heading font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          Recarregar
        </button>
        <button
          onClick={() => window.location.assign("/")}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-surface-2 px-4 text-sm font-semibold text-foreground"
        >
          Ir para início
        </button>
      </div>
    </div>
  </div>
);

/** Wraps a lazy page with its own error boundary so one broken page doesn't kill the app */
const SafePage = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto text-2xl">⚠️</div>
          <h2 className="text-lg font-bold text-foreground">Erro ao carregar a página</h2>
          <p className="text-sm text-muted-foreground">Tente recarregar ou voltar ao início.</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground">Recarregar</button>
            <button onClick={() => window.location.assign("/")} className="px-4 py-2 rounded-lg text-sm font-semibold bg-surface-2 text-foreground">Início</button>
          </div>
        </div>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);

const AuthenticatedPage = ({ children }: { children: ReactNode }) => (
  <SafePage>
    <AuthShell>{children}</AuthShell>
  </SafePage>
);

const authRouteElement = (children: ReactNode) =>
  hasBackendConfig ? (
    <AuthenticatedPage>{children}</AuthenticatedPage>
  ) : (
    <SafePage>
      <BackendUnavailablePage
        title="Acesso temporariamente indisponível"
        description="Esta publicação está sem a configuração necessária para abrir login, cadastro e recuperação de senha. Atualize a publicação e tente novamente."
      />
    </SafePage>
  );

const protectedRouteElement = (children: ReactNode) =>
  hasBackendConfig ? (
    <AuthenticatedPage>{children}</AuthenticatedPage>
  ) : (
    <SafePage>
      <BackendUnavailablePage
        title="Área do atleta indisponível"
        description="A página interna depende da configuração do backend desta publicação. Atualize a publicação para liberar login e painel."
      />
    </SafePage>
  );

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner />
          {showSplash && <SplashScreen onFinish={hideSplash} />}
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<SafePage><LandingPage /></SafePage>} />
                <Route path="/login" element={authRouteElement(<Login />)} />
                <Route path="/reset-password" element={authRouteElement(<ResetPassword />)} />
                <Route path="/dashboard" element={protectedRouteElement(<Dashboard />)} />
                <Route path="/treinos" element={protectedRouteElement(<Treinos />)} />
                <Route path="/avaliacao" element={protectedRouteElement(<Avaliacao />)} />
                <Route path="/personal" element={protectedRouteElement(<PersonalTrainer />)} />
                <Route path="/active-training" element={protectedRouteElement(<ActiveTraining />)} />
                <Route path="/training-complete" element={protectedRouteElement(<TrainingComplete />)} />
                <Route path="/historico" element={protectedRouteElement(<Historico />)} />
                <Route path="/calendario" element={protectedRouteElement(<Calendario />)} />
                <Route path="/ranking" element={protectedRouteElement(<Ranking />)} />
                <Route path="/admin" element={protectedRouteElement(<Admin />)} />
                <Route path="*" element={<SafePage><NotFound /></SafePage>} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
