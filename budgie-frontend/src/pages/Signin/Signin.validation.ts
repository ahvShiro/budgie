import type { RegisterDTO } from "@/services/types";
import type { FieldErrors, FieldName, Fields } from "./types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/;

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 64;
const MIN_PASSWORD_LENGTH = 8;

export const FIELD_NAMES: FieldName[] = [
  "name",
  "email",
  "password",
  "passwordConfirmation",
];

export type ValidationResult =
  | { ok: true; data: RegisterDTO }
  | { ok: false; errors: FieldErrors };

export const validateField = (
  name: FieldName,
  fields: Fields,
): string | undefined => {
  const value = fields[name] ?? "";
  const trimmed = value.trim();

  switch (name) {
    case "name":
      if (trimmed.length === 0) return "Campo nome é obrigatório";
      if (trimmed.length < MIN_NAME_LENGTH || trimmed.length > MAX_NAME_LENGTH)
        return `Campo nome deve ter entre ${MIN_NAME_LENGTH} e ${MAX_NAME_LENGTH} caracteres`;
      return undefined;

    case "email":
      if (trimmed.length === 0) return "Campo email é obrigatório";
      if (!EMAIL_REGEX.test(trimmed)) return "Email deve ser válido";
      return undefined;

    case "password":
      if (trimmed.length === 0) return "Campo senha é obrigatório";
      if (value.length < MIN_PASSWORD_LENGTH)
        return `Senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres`;
      if (!STRONG_PASSWORD_REGEX.test(value))
        return "Senha deve conter ao menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial";
      return undefined;

    case "passwordConfirmation":
      if (trimmed.length === 0) return "Confirmação da senha é obrigatória";
      if (value !== (fields.password ?? "")) return "Senhas são diferentes";
      return undefined;
  }
};

export const validate = (fields: Fields): ValidationResult => {
  const errors: FieldErrors = {};

  for (const name of FIELD_NAMES) {
    const error = validateField(name, fields);

    if (error) errors[name] = error;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name: (fields.name ?? "").trim(),
      email: (fields.email ?? "").trim(),
      password: fields.password ?? "",
      passwordConfirmation: fields.passwordConfirmation ?? "",
    },
  };
};
