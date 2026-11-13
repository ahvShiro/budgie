import { z } from 'zod';

export const memberSchema = z.object({
  email: z
    .email('Campo e-mail deve ser um e-mail válido')
    .trim()
    .min(1, 'Campo e-mail é obrigatório'),

  role: z.enum(['EDITOR', 'VIEWER'], 'Campo papel é obrigatório'),
});

export type Fields = z.infer<typeof memberSchema>;

export const initialValues: Fields = {
  email: '',
  role: 'EDITOR',
};
