export interface Fields {
  name?: string; 
  email?: string;
  password?: string;
  passwordConfirmation?: string;
}

export interface FieldErrors extends Fields {}