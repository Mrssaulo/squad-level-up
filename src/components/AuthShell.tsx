import { lazy, Suspense, type ReactNode } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

const FloatingChat = lazy(() => import("@/components/FloatingChat"));

const AuthShell = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        {children}

        <ErrorBoundary fallback={<></>}>
          <Suspense fallback={null}>
            <FloatingChat />
          </Suspense>
        </ErrorBoundary>
      </SubscriptionProvider>
    </AuthProvider>
  );
};

export default AuthShell;
