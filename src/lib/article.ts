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

// Get single article by id (atau slug, kalau API support slug)
export async function fetchArticleById(id: string): Promise<Article> {
  const res = await api.get(`/articles/${id}`);
  return res.data;
}

// Get related articles (ambil dari kategori yang sama)
export async function fetchRelatedArticles(
  categoryId: string,
  excludeId: string
): Promise<Article[]> {
  const res = await api.get("/articles", {
    params: { categoryId, limit: 3 },
  });
  // filter artikel sekarang supaya tidak muncul di related
  return res.data.data.filter((a: Article) => a.id !== excludeId).slice(0, 3);
}
