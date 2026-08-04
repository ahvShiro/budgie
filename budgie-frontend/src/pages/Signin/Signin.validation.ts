import { z } from "zod";

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/;

export const signinSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Campo nome é obrigatório")
      .min(2, "Campo nome deve ter entre 2 e 64 caracteres")
      .max(64, "Campo nome deve ter entre 2 e 64 caracteres"),

    email: z
      .email("Email deve ser válido")
      .trim()
      .min(1, "Campo email é obrigatório")
     ,

    password: z
      .string()
      .min(1, "Campo senha é obrigatório")
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .regex(
        STRONG_PASSWORD_REGEX,
        "Senha deve conter ao menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial",
      ),

    passwordConfirmation: z.string().min(1, "Confirmação da senha é obrigatória"),
  })

  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Senhas são diferentes",
    path: ["passwordConfirmation"],
  });

export type Fields = z.infer<typeof signinSchema>;

export const initialValues: Fields = {
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};
