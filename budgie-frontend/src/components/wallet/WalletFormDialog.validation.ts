import { z } from 'zod';

export const walletSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Campo nome é obrigatório')
    .min(2, 'Campo nome deve ter entre 2 e 64 caracteres')
    .max(64, 'Campo nome deve ter entre 2 e 64 caracteres'),

  description: z
    .string()
    .trim()
    .max(128, 'Campo descrição deve ter menos de 128 caracteres'),
});

export type Fields = z.infer<typeof walletSchema>;

export const initialValues: Fields = {
  name: '',
  description: '',
};
