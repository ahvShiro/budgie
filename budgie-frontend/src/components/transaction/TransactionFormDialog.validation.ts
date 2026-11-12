import { z } from 'zod';
import { nowLocalDateTimeString } from '@/lib/dates.ts';

export const transactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE'], 'Campo tipo é obrigatório'),

  value: z
    .string()
    .trim()
    .min(1, 'Campo valor é obrigatório')
    .refine((v) => Number(v) >= 0.01, 'Campo valor deve ser maior que zero'),

  description: z
    .string()
    .trim()
    .max(128, 'Campo descrição deve ter menos de 128 caracteres'),

  date: z
    .string()
    .min(1, 'Campo data é obrigatório')
    .refine(
      (v) => v <= nowLocalDateTimeString(),
      'Campo data não pode ser no futuro'
    ),

  categoryId: z.number().nullable(),
});

export type Fields = z.infer<typeof transactionSchema>;

export const initialValues: Fields = {
  type: 'EXPENSE',
  value: '',
  description: '',
  date: nowLocalDateTimeString(),
  categoryId: null,
};
