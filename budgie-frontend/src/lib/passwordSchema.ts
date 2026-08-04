import { z } from "zod";

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/;

export const passwordSchema = z
  .string()
  .min(1, "Campo senha é obrigatório")
  .min(8, "Senha deve ter no mínimo 8 caracteres")
  .regex(
    STRONG_PASSWORD_REGEX,
    "Senha deve conter ao menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial",
  );
