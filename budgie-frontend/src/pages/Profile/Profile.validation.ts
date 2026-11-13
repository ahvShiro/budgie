import { z } from 'zod';

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Campo nome é obrigatório')
    .min(2, 'Campo nome deve ter entre 2 e 64 caracteres')
    .max(64, 'Campo nome deve ter entre 2 e 64 caracteres'),
});

export type Fields = z.infer<typeof profileSchema>;

export const initialValues: Fields = {
  name: '',
};
