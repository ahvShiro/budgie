import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser, useSetCurrentUser } from '@/hooks/useCurrentUser.ts';
import { toastApiError } from '@/lib/apiErrors.ts';
import { formatDate } from '@/lib/formatters.ts';
import { toFieldErrors, type FieldErrors } from '@/lib/validationErrors';
import UserService from '@/services/UserService';
import type { ApiUserResponseDTO } from '@/services/types.ts';
import { useState } from 'react';
import { toast } from 'sonner';
import { profileSchema, type Fields } from './Profile.validation';

interface ProfileFormProps {
  user: ApiUserResponseDTO;
}

const ProfileForm = ({ user }: ProfileFormProps) => {
  const setCurrentUser = useSetCurrentUser();

  const [fields, setFields] = useState<Fields>({ name: user.name });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<Fields>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasChanges = fields.name.trim() !== user.name;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const result = profileSchema.safeParse(fields);

    if (!result.success) {
      setFieldErrors(toFieldErrors<Fields>(result.error));
      return;
    }

    setIsSubmitting(true);
    try {
      setCurrentUser(await UserService.updateMe(result.data));
      toast.success('Perfil atualizado!');
    } catch (err) {
      toastApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Insira seu nome"
              value={fields.name}
              onChange={handleChange}
            />
            <FieldError
              errors={fieldErrors.name ? [{ message: fieldErrors.name }] : []}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input type="email" id="email" value={user.email} disabled />
          </Field>
          <FieldDescription>
            Membro desde {formatDate(new Date(user.createdAt))}
          </FieldDescription>

          <Field orientation="horizontal">
            <Button type="submit" disabled={isSubmitting || !hasChanges}>
              {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export const Profile = () => {
  const user = useCurrentUser();

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-3xl font-extrabold">Seu perfil</h1>

      {user ? (
        <ProfileForm user={user} />
      ) : (
        <div className="flex w-full max-w-md flex-col gap-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      )}
    </main>
  );
};
