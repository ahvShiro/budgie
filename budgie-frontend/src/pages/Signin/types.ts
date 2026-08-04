export interface Fields {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
}

export type FieldName = keyof Fields;

export type FieldErrors = Partial<Record<FieldName, string>>;
