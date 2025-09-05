"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/store/auth";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);

    try {
      logout();
      toast.success("Logout berhasil! 👋");

      // redirect cepat setelah 0.5 detik
      setTimeout(() => {
        router.replace("/");
      }, 500);
    } catch (error) {
      toast.error("Terjadi kesalahan saat logout");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="flex items-center justify-between p-6 md:bg-transparent bg-white">
      <Link href="/" className="flex items-center gap-2">
        <Image
          className="hidden md:block"
          alt="Logo"
          width={134}
          height={24}
          src="/Logo.png"
        />
        <Image
          className="md:hidden block"
          alt="Logo"
          width={134}
          height={24}
          src="/Frame.png"
        />
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/profile">
              <Avatar className="w-8 h-8 bg-blue-200">
                <AvatarFallback className="text-blue-800 font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isLoading}>
                  {isLoading ? "Logging out..." : "Logout"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Yakin mau logout?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Kamu akan keluar dari akun ini dan harus login lagi untuk
                    mengakses aplikasi.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isLoading}>
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Ya, Logout"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <Button asChild size="sm">
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
