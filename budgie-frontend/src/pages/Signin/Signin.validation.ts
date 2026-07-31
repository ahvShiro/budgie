import type { FieldErrors, Fields } from "./types";

export const validate = (fields: Fields): FieldErrors => {
  const errors: FieldErrors = {};

  if (fields.name == undefined || fields.name.trim().length <= 0) errors.name = "Campo nome não pode ser vazio";
  if (fields.email == undefined || fields.email.trim().length <= 0) errors.email = "Campo email não pode ser vazio";
  if (fields.password == undefined || fields.password.trim().length <= 0) errors.password = "Campo senha não pode ser vazio";
  if (fields.passwordConfirmation == undefined || fields.passwordConfirmation.trim().length <= 0) errors.passwordConfirmation = "Campo confirmação de senha não pode ser vazio";
  if (fields.password !== fields.passwordConfirmation) errors.passwordConfirmation = "Senhas são diferentes";

  return errors;
}