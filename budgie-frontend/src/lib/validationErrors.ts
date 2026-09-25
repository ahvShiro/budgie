import type { ZodError } from "zod";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export const toFieldErrors = <T,>(error: ZodError): FieldErrors<T> => {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = String(issue.path[0]);

    if (field && !(field in errors)) {
      errors[field] = issue.message;
    }
  }

  return errors as FieldErrors<T>;
};
