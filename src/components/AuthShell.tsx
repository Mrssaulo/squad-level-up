import { lazy, Suspense, type ReactNode } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";

const FloatingChat = lazy(() => import("@/components/FloatingChat"));

const AuthShell = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      {children}

      <ErrorBoundary fallback={<></>}>
        <Suspense fallback={null}>
          <FloatingChat />
        </Suspense>
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default AuthShell;