import { useState, useCallback, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import SplashScreen from "./components/SplashScreen";

// Lazy load all pages so a single broken page doesn't block the entire app
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

// Lazy load non-essential global components
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
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/treinos" element={<Treinos />} />
                  <Route path="/avaliacao" element={<Avaliacao />} />
                  <Route path="/personal" element={<PersonalTrainer />} />
                  <Route path="/active-training" element={<ActiveTraining />} />
                  <Route path="/training-complete" element={<TrainingComplete />} />
                  <Route path="/historico" element={<Historico />} />
                  <Route path="/calendario" element={<Calendario />} />
                  <Route path="/ranking" element={<Ranking />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Suspense fallback={null}>
                <FloatingChat />
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
