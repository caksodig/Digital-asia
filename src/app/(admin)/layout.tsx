// Versi yang lebih clean menggunakan custom hook
"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized, user } = useAuthGuard({
    requiredRole: "Admin",
    redirectTo: "/login",
    redirectUnauthorized: "/",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  if (!isAuthorized) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="border-b bg-background">
          <div className="flex h-16 items-center px-4">
            <SidebarTrigger />
            <div className="ml-auto flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, <strong>{user?.username}</strong> ({user?.role})
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
