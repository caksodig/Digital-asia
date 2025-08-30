import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(3, "Nama kategori minimal 3 karakter")
    .max(50, "Nama kategori maksimal 50 karakter"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
