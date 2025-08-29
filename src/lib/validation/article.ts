import { z } from "zod";

// Schema untuk create/update article
export const ArticleSchema = z.object({
  title: z.string().min(3, "Title minimal 3 karakter"),
  content: z.string().min(10, "Content minimal 10 karakter"),
  categoryId: z.string().uuid("CategoryId harus berupa UUID"),
});

// Type inference
export type ArticleInput = z.infer<typeof ArticleSchema>;

export const CreateArticleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters"),

  content: z
    .string()
    .min(1, "Content is required")
    .min(50, "Content must be at least 50 characters")
    .max(10000, "Content must be less than 10,000 characters"),

  categoryId: z.string().min(1, "Category is required"),

  thumbnail: z.string().url("Invalid thumbnail URL").optional(),
});

export const UpdateArticleSchema = CreateArticleSchema.partial();

export type CreateArticleInput = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>;

// Client-side validation for form
export interface ArticleFormData {
  title: string;
  content: string;
  categoryId: string;
  thumbnail: File | null;
}

export interface ArticleFormErrors {
  title?: string;
  content?: string;
  categoryId?: string;
  thumbnail?: string;
}

export const validateArticleForm = (
  data: ArticleFormData
): ArticleFormErrors => {
  const errors: ArticleFormErrors = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = "Judul artikel wajib diisi";
  } else if (data.title.trim().length < 5) {
    errors.title = "Judul minimal 5 karakter";
  } else if (data.title.trim().length > 200) {
    errors.title = "Judul maksimal 200 karakter";
  }

  // Content validation
  if (!data.content.trim()) {
    errors.content = "Konten artikel wajib diisi";
  } else if (data.content.trim().length < 50) {
    errors.content = "Konten minimal 50 karakter";
  } else if (data.content.trim().length > 10000) {
    errors.content = "Konten maksimal 10.000 karakter";
  }

  // Category validation
  if (!data.categoryId) {
    errors.categoryId = "Kategori wajib dipilih";
  }

  // Thumbnail validation
  if (data.thumbnail) {
    if (!data.thumbnail.type.startsWith("image/")) {
      errors.thumbnail = "File harus berupa gambar";
    } else if (data.thumbnail.size > 5 * 1024 * 1024) {
      errors.thumbnail = "Ukuran file maksimal 5MB";
    }
  }

  return errors;
};

export const hasValidationErrors = (errors: ArticleFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
