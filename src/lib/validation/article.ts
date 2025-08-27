import { z } from "zod";

// Schema untuk create/update article
export const ArticleSchema = z.object({
  title: z.string().min(3, "Title minimal 3 karakter"),
  content: z.string().min(10, "Content minimal 10 karakter"),
  categoryId: z.string().uuid("CategoryId harus berupa UUID"),
});

// Type inference
export type ArticleInput = z.infer<typeof ArticleSchema>;
