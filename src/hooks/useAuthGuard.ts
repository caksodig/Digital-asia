import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/store/auth";

type AuthGuardOptions = {
  requiredRole?: "Admin" | "User";
  redirectTo?: string;
  redirectUnauthorized?: string;
};

export function useAuthGuard(options: AuthGuardOptions = {}) {
  const {
    requiredRole,
    redirectTo = "/login",
    redirectUnauthorized = "/",
  } = options;

  const { user, isAuthenticated, isLoading, restoreSession } = useAuthStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await restoreSession();
      } catch (error) {
        console.error("Failed to restore session:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [restoreSession]);

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    // Check authentication
    if (!isAuthenticated || !user) {
      setIsAuthorized(false);
      router.replace(redirectTo);
      return;
    }

    // Check role authorization
    if (requiredRole && user.role !== requiredRole) {
      setIsAuthorized(false);
      router.replace(redirectUnauthorized);
      return;
    }

    setIsAuthorized(true);
  }, [
    isInitialized,
    isLoading,
    isAuthenticated,
    user,
    requiredRole,
    redirectTo,
    redirectUnauthorized,
    router,
  ]);

  return {
    isLoading: !isInitialized || isLoading,
    isAuthorized,
    user,
    isAuthenticated,
  };
}
