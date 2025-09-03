import { create } from "zustand";
import api from "@/lib/axios";

export type User = {
  id: string;
  username: string;
  role: "Admin" | "User";
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  fetchProfile: () => Promise<User>;
  restoreSession: () => Promise<void>;
};

const getStoredToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const setStoredToken = (token: string | null) => {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (username, password) => {
    set({ isLoading: true });

    try {
      const response = await api.post(
        "/auth/login",
        {
          username,
          password,
        },
        {
          headers: {
            Authorization: undefined,
          },
        }
      );

      const token = response.data.token || response.data.access_token;
      if (!token) throw new Error("Token not found in response");

      setStoredToken(token);
      set({ token });

      await new Promise((resolve) => setTimeout(resolve, 10));

      const profileResponse = await api.get("/auth/profile");
      const user: User = profileResponse.data;

      set({ user, isAuthenticated: true, isLoading: false });

      return user;
    } catch (error: any) {
      setStoredToken(null);
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      throw error;
    }
  },

  logout: () => {
    setStoredToken(null);
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  fetchProfile: async () => {
    const { token } = get();
    if (!token) {
      throw new Error("No token available");
    }

    try {
      const response = await api.get("/auth/profile");
      const user: User = response.data;
      set({ user, isAuthenticated: true });
      return user;
    } catch (error) {
      setStoredToken(null);
      set({ token: null, user: null, isAuthenticated: false });
      throw error;
    }
  },

  restoreSession: async () => {
    const token = getStoredToken();
    if (!token) {
      set({ token: null, user: null, isAuthenticated: false });
      return;
    }

    set({ isLoading: true });

    try {
      set({ token });

      const response = await api.get("/auth/profile");
      const user: User = response.data;

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setStoredToken(null);
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
