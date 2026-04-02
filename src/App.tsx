import { useState, useCallback, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import SplashScreen from "./components/SplashScreen";

const LandingPage = lazy(() => import("./pages/LandingPage"));
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
const FloatingChat = lazy(() => import("./components/FloatingChat"));

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
const SafePage = ({ children }: { children: React.ReactNode }) => (
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
            <AuthProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<SafePage><LandingPage /></SafePage>} />
                  <Route path="/login" element={<SafePage><Login /></SafePage>} />
                  <Route path="/reset-password" element={<SafePage><ResetPassword /></SafePage>} />
                  <Route path="/dashboard" element={<SafePage><Dashboard /></SafePage>} />
                  <Route path="/treinos" element={<SafePage><Treinos /></SafePage>} />
                  <Route path="/avaliacao" element={<SafePage><Avaliacao /></SafePage>} />
                  <Route path="/personal" element={<SafePage><PersonalTrainer /></SafePage>} />
                  <Route path="/active-training" element={<SafePage><ActiveTraining /></SafePage>} />
                  <Route path="/training-complete" element={<SafePage><TrainingComplete /></SafePage>} />
                  <Route path="/historico" element={<SafePage><Historico /></SafePage>} />
                  <Route path="/calendario" element={<SafePage><Calendario /></SafePage>} />
                  <Route path="/ranking" element={<SafePage><Ranking /></SafePage>} />
                  <Route path="/admin" element={<SafePage><Admin /></SafePage>} />
                  <Route path="*" element={<SafePage><NotFound /></SafePage>} />
                </Routes>
              </Suspense>
              {/* FloatingChat is non-essential — never blocks the app */}
              <ErrorBoundary fallback={<></>}>
                <Suspense fallback={null}>
                  <FloatingChat />
                </Suspense>
              </ErrorBoundary>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
