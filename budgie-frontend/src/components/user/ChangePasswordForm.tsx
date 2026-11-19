import { PasswordInput } from '@/components/PasswordInput';
import { PasswordStrengthMeter } from '@/components/PasswordStrengthMeter';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { toastApiError } from '@/lib/apiErrors.ts';
import { toFieldErrors, type FieldErrors } from '@/lib/validationErrors';
import UserService from '@/services/UserService';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  changePasswordSchema,
  initialValues,
  type Fields,
} from './ChangePasswordForm.validation';

export const ChangePasswordForm = () => {
  const [fields, setFields] = useState<Fields>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<Fields>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFields((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const result = changePasswordSchema.safeParse(fields);

    if (!result.success) {
      setFieldErrors(toFieldErrors<Fields>(result.error));
      return;
    }

    setIsSubmitting(true);
    try {
      await UserService.updatePassword(result.data);
      toast.success('Senha alterada com sucesso!');
      setFields(initialValues);
    } catch (err) {
      toastApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <FieldSet>
        <h2 className="text-xl font-bold">Alterar senha</h2>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="currentPassword">Senha atual</FieldLabel>
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              autoComplete="current-password"
              value={fields.currentPassword}
              onChange={handleChange}
            />
            <FieldError
              errors={
                fieldErrors.currentPassword
                  ? [{ message: fieldErrors.currentPassword }]
                  : []
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="newPassword">Nova senha</FieldLabel>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              autoComplete="new-password"
              value={fields.newPassword}
              onChange={handleChange}
            />
            <FieldError
              errors={
                fieldErrors.newPassword
                  ? [{ message: fieldErrors.newPassword }]
                  : []
              }
            />
            <PasswordStrengthMeter password={fields.newPassword} />
          </Field>

          <Field>
            <FieldLabel htmlFor="newPasswordConfirmation">
              Confirmação da nova senha
            </FieldLabel>
            <PasswordInput
              id="newPasswordConfirmation"
              name="newPasswordConfirmation"
              autoComplete="new-password"
              value={fields.newPasswordConfirmation}
              onChange={handleChange}
            />
            <FieldError
              errors={
                fieldErrors.newPasswordConfirmation
                  ? [{ message: fieldErrors.newPasswordConfirmation }]
                  : []
              }
            />
          </Field>

          <Field orientation="horizontal">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Alterando...' : 'Alterar senha'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};
