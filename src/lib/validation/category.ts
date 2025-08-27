import { z } from "zod";

// Schema untuk create/update category
export const CategorySchema = z.object({
  name: z.string().min(3, "Nama kategori minimal 3 karakter"),
});

// Type inference
export type CategoryInput = z.infer<typeof CategorySchema>;
