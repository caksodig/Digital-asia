import api from "./axios";
import { Category } from "../types/category";

export interface CategoryResponse {
  data: Category[];
  totalData: number;
  currentPage: number;
  totalPages: number;
}

export const categoriesApi = {
  async getAll(page: number = 1): Promise<CategoryResponse> {
    const res = await api.get(`/categories?page=${page}`);
    return res.data;
  },

  async getById(id: string): Promise<Category> {
    const res = await api.get(`/categories/${id}`);
    return res.data?.data ?? res.data;
  },

  async create(payload: { name: string }): Promise<Category> {
    const res = await api.post("/categories", payload);
    return res.data?.data ?? res.data;
  },

  async update(id: string, payload: { name: string }): Promise<Category> {
    const res = await api.put(`/categories/${id}`, payload);
    return res.data?.data ?? res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

export type ApiError = {
  message: string;
  statusCode?: number;
};
