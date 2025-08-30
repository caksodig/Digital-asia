import api from "@/lib/axios";
import { Article, ArticleResponse } from "@/types/article";

export async function fetchArticles(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}): Promise<ArticleResponse> {
  const res = await api.get("/articles", { params });
  return res.data;
}

export async function fetchArticleById(id: string): Promise<Article> {
  const res = await api.get(`/articles/${id}`);
  return res.data;
}

export async function fetchRelatedArticles(
  categoryId: string,
  excludeId: string
): Promise<Article[]> {
  const res = await api.get("/articles", {
    params: { categoryId, limit: 3 },
  });
  return res.data.data.filter((a: Article) => a.id !== excludeId).slice(0, 3);
}
