import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import SplashScreen from "./components/SplashScreen";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Treinos from "./pages/Treinos";
import Avaliacao from "./pages/Avaliacao";
import PersonalTrainer from "./pages/PersonalTrainer";
import ActiveTraining from "./pages/ActiveTraining";
import TrainingComplete from "./pages/TrainingComplete";
import Historico from "./pages/Historico";
import Calendario from "./pages/Calendario";
import Ranking from "./pages/Ranking";
import FloatingChat from "./components/FloatingChat";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        {showSplash && <SplashScreen onFinish={hideSplash} />}
        <BrowserRouter>
          <AuthProvider>
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
            <FloatingChat />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
