import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["User", "Admin"]).refine((val) => val, {
    message: "Role wajib dipilih",
  }),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;
