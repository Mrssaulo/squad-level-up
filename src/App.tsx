import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Treinos from "./pages/Treinos";
import Avaliacao from "./pages/Avaliacao";
import NotFound from "./pages/NotFound";
import { getAthlete } from "./lib/storage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={getAthlete() ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/treinos" element={<Treinos />} />
          <Route path="/avaliacao" element={<Avaliacao />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
