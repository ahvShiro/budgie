import { Button } from '@/components/ui/button.tsx';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { toastApiError } from '@/lib/apiErrors.ts';
import { toFieldErrors, type FieldErrors } from '@/lib/validationErrors.ts';
import WalletService from '@/services/WalletService.ts';
import type { ApiWalletListingDTO } from '@/services/types.ts';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  initialValues,
  walletSchema,
  type Fields,
} from './WalletFormDialog.validation.ts';

interface WalletFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
  wallet?: ApiWalletListingDTO | null;
}

export const WalletFormDialog = ({
  open,
  onOpenChange,
  onSaved,
  wallet,
}: WalletFormDialogProps) => {
  const isEditing = !!wallet;

  const [fields, setFields] = useState<Fields>(
    wallet
      ? { name: wallet.name, description: wallet.description ?? '' }
      : initialValues
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<Fields>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) return;

    if (!nextOpen) {
      setFields(initialValues);
      setFieldErrors({});
    }

    onOpenChange(nextOpen);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const result = walletSchema.safeParse(fields);

    if (!result.success) {
      setFieldErrors(toFieldErrors<Fields>(result.error));
      return;
    }

    setIsSubmitting(true);

    try {
      if (wallet) {
        await WalletService.updateWallet(wallet.id, {
          ...result.data,
          active: true,
        });
        toast.success('Carteira atualizada com sucesso!');
      } else {
        await WalletService.createWallet(result.data);
        toast.success('Carteira criada com sucesso!');
      }
      setFields(initialValues);
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toastApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar carteira' : 'Nova carteira'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Altere o nome ou a descrição da carteira.'
                : 'Crie uma carteira para organizar suas receitas e despesas.'}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Ex: Casa, Viagem, Pessoal"
                autoComplete="off"
                enterKeyHint="next"
                value={fields.name}
                onChange={handleChange}
              />
              <FieldError
                errors={fieldErrors.name ? [{ message: fieldErrors.name }] : []}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Descrição</FieldLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="Opcional"
                value={fields.description}
                onChange={handleChange}
              />
              <FieldDescription className="text-right">
                {fields.description.length}/128
              </FieldDescription>
              <FieldError
                errors={
                  fieldErrors.description
                    ? [{ message: fieldErrors.description }]
                    : []
                }
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing
                ? isSubmitting
                  ? 'Salvando...'
                  : 'Salvar alterações'
                : isSubmitting
                  ? 'Criando...'
                  : 'Criar carteira'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
