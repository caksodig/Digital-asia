import { Category } from "./category";
import { User } from "./user";

export type Article = {
  id: string;
  title: string;
  content: string;
  image?: string;
  userId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  user: User;
};

export type ArticleResponse = {
  data: Article[];
  total: number;
  page: number;
  limit: number;
};
