import { create } from "zustand";
import api from "@/lib/axios";

export type Article = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

type ArticleState = {
  articles: Article[];
  loading: boolean;
  fetchArticles: () => Promise<void>;
  addArticle: (article: Omit<Article, "id" | "createdAt">) => Promise<void>;
  updateArticle: (id: string, article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
};

export const useArticleStore = create<ArticleState>((set, get) => ({
  articles: [],
  loading: false,

  fetchArticles: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/articles");
      set({ articles: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Failed to fetch articles", error);
    }
  },

  addArticle: async (article) => {
    try {
      const res = await api.post("/articles", article);
      set({ articles: [res.data, ...get().articles] });
    } catch (error) {
      console.error("Failed to add article", error);
    }
  },

  updateArticle: async (id, article) => {
    try {
      const res = await api.put(`/articles/${id}`, article);
      set({
        articles: get().articles.map((a) => (a.id === id ? res.data : a)),
      });
    } catch (error) {
      console.error("Failed to update article", error);
    }
  },

  deleteArticle: async (id) => {
    try {
      await api.delete(`/articles/${id}`);
      set({ articles: get().articles.filter((a) => a.id !== id) });
    } catch (error) {
      console.error("Failed to delete article", error);
    }
  },
}));
