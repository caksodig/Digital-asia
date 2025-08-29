"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/store/auth";
import { LoginSchema, LoginInput } from "@/lib/validation/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  // Redirect jika sudah authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginInput) => {
    if (loading || authLoading) return;

    setLoading(true);

    try {
      const user = await login(data.username, data.password);

      toast.success(`Selamat datang, ${user.username}! 🎉`);

      // Redirect sesuai role dengan delay untuk toast
      const redirectPath = user.role === "Admin" ? "/admin/articles" : "/";

      setTimeout(() => {
        router.replace(redirectPath);
      }, 1000);
    } catch (err: any) {
      console.error("Login error:", err);

      // Enhanced error handling
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;

      switch (status) {
        case 400:
          if (message?.includes("username")) {
            setError("username", { message: "Format username tidak valid" });
          } else if (message?.includes("password")) {
            setError("password", { message: "Format password tidak valid" });
          } else {
            toast.error("Data yang dikirim tidak valid");
          }
          break;

        case 401:
          setError("password", { message: "Password salah" });
          toast.error("Username atau password salah");
          break;

        case 404:
          setError("username", { message: "Username tidak ditemukan" });
          toast.error("Username tidak ditemukan");
          break;

        case 429:
          toast.error("Terlalu banyak percobaan, coba lagi nanti");
          break;

        case 500:
          toast.error("Server sedang bermasalah, coba lagi nanti");
          break;

        default:
          if (message === "Token not found in response") {
            toast.error("Format response tidak valid dari server");
          } else if (!navigator.onLine) {
            toast.error("Tidak ada koneksi internet");
          } else if (err.code === "NETWORK_ERROR") {
            toast.error("Gagal terhubung ke server");
          } else {
            toast.error("Terjadi kesalahan tidak terduga");
          }
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading if authenticating
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Masuk</h1>
          <p className="text-sm text-gray-600 mt-2">
            Silakan masuk ke akun Anda
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              {...register("username")}
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.username ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Masukkan username"
              disabled={loading}
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.password ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Masukkan password"
              disabled={loading}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
