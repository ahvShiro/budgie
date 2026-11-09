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
import { useState } from 'react';
import { toast } from 'sonner';
import {
  initialValues,
  walletSchema,
  type Fields,
} from './CreateWalletDialog.validation.ts';

interface CreateWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export const CreateWalletDialog = ({
  open,
  onOpenChange,
  onCreated,
}: CreateWalletDialogProps) => {
  const [fields, setFields] = useState<Fields>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<Fields>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Limpa o form ao fechar pra não reabrir com o lixo da tentativa anterior
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
      await WalletService.createWallet(result.data);
      toast.success('Carteira criada com sucesso!');
      setFields(initialValues);
      onOpenChange(false);
      onCreated();
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
            <DialogTitle>Nova carteira</DialogTitle>
            <DialogDescription>
              Crie uma carteira para organizar suas receitas e despesas.
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
              {isSubmitting ? 'Criando...' : 'Criar carteira'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
