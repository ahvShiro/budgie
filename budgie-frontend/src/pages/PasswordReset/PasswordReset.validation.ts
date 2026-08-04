import { passwordSchema } from "@/lib/passwordSchema";
import z from "zod";

export const resetSchema = z
  .object({
    newPassword: passwordSchema,
    newPasswordConfirmation: z
      .string()
      .min(1, "Confirmação da senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "Senhas são diferentes",
    path: ["newPasswordConfirmation"],
  });

export type Fields = z.infer<typeof resetSchema>;

export const initialValues: Fields = { newPassword: "", newPasswordConfirmation: "" };
