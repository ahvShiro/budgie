import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("E-mail inválido").trim().min(1, "Campo obrigatório"),
  password: z.string().min(1, "Campo obrigatório").min(6, "Mínimo 6 caracteres"),
});

export type Fields = z.infer<typeof loginSchema>;

export const initialValues: Fields = {
  email: "",
  password: "",
};
