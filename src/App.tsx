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
const Planos = lazy(() => import("./pages/Planos"));
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

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
                <Route path="/login" element={<AuthenticatedPage><Login /></AuthenticatedPage>} />
                <Route path="/reset-password" element={<AuthenticatedPage><ResetPassword /></AuthenticatedPage>} />
                <Route path="/dashboard" element={<AuthenticatedPage><Dashboard /></AuthenticatedPage>} />
                <Route path="/treinos" element={<AuthenticatedPage><Treinos /></AuthenticatedPage>} />
                <Route path="/avaliacao" element={<AuthenticatedPage><Avaliacao /></AuthenticatedPage>} />
                <Route path="/personal" element={<AuthenticatedPage><PersonalTrainer /></AuthenticatedPage>} />
                <Route path="/active-training" element={<AuthenticatedPage><ActiveTraining /></AuthenticatedPage>} />
                <Route path="/training-complete" element={<AuthenticatedPage><TrainingComplete /></AuthenticatedPage>} />
                <Route path="/historico" element={<AuthenticatedPage><Historico /></AuthenticatedPage>} />
                <Route path="/calendario" element={<AuthenticatedPage><Calendario /></AuthenticatedPage>} />
                <Route path="/ranking" element={<AuthenticatedPage><Ranking /></AuthenticatedPage>} />
                <Route path="/planos" element={<AuthenticatedPage><Planos /></AuthenticatedPage>} />
                <Route path="/admin" element={<AuthenticatedPage><Admin /></AuthenticatedPage>} />
                <Route path="*" element={<SafePage><NotFound /></SafePage>} />
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
