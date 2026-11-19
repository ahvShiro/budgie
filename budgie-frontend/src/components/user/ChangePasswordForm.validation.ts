import { passwordSchema } from '@/lib/passwordSchema';
import z from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: passwordSchema,
    newPasswordConfirmation: z
      .string()
      .min(1, 'Confirmação da senha é obrigatória'),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: 'Senhas são diferentes',
    path: ['newPasswordConfirmation'],
  });

export type Fields = z.infer<typeof changePasswordSchema>;

export const initialValues: Fields = {
  currentPassword: '',
  newPassword: '',
  newPasswordConfirmation: '',
};
