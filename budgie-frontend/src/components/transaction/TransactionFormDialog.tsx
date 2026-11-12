import { CategoryCombobox } from '@/components/category/CategoryCombobox.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Calendar } from '@/components/ui/calendar.tsx';
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import { toastApiError } from '@/lib/apiErrors.ts';
import {
  parseLocalDate,
  toLocalDateString,
  todayLocalDateString,
} from '@/lib/dates.ts';
import { formatLongDate } from '@/lib/formatters.ts';
import { toFieldErrors, type FieldErrors } from '@/lib/validationErrors.ts';
import TransactionService from '@/services/TransactionService.ts';
import type {
  ApiCategoryResponseDTO,
  ApiTransactionResponseDTO,
  TransactionType,
} from '@/services/types.ts';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { ptBR } from 'react-day-picker/locale';
import { toast } from 'sonner';
import {
  initialValues,
  transactionSchema,
  type Fields,
} from './TransactionFormDialog.validation.ts';

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
  walletId: number;
  categories: ApiCategoryResponseDTO[];
  onCategoryCreated: (category: ApiCategoryResponseDTO) => void;
  transaction?: ApiTransactionResponseDTO | null;
}

const freshValues = (): Fields => ({
  ...initialValues,
  date: todayLocalDateString(),
});

export const TransactionFormDialog = ({
  open,
  onOpenChange,
  onSaved,
  walletId,
  categories,
  onCategoryCreated,
  transaction,
}: TransactionFormDialogProps) => {
  const isEditing = !!transaction;

  const [fields, setFields] = useState<Fields>(
    transaction
      ? {
          type: transaction.type,
          value: transaction.value.toString(),
          description: transaction.description ?? '',
          date: transaction.date,
          categoryId: transaction.categoryId,
        }
      : freshValues
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<Fields>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) return;

    if (!nextOpen) {
      setFields(freshValues());
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

  const handleTypeChange = (value: string) => {
    if (!value) return;
    setFields((prev) => ({
      ...prev,
      type: value as TransactionType,
      categoryId: null,
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setFields((prev) => ({ ...prev, date: toLocalDateString(date) }));
    setFieldErrors((prev) => ({ ...prev, date: undefined }));
    setIsCalendarOpen(false);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const result = transactionSchema.safeParse(fields);

    if (!result.success) {
      setFieldErrors(toFieldErrors<Fields>(result.error));
      return;
    }

    const data = { ...result.data, value: Number(result.data.value) };

    setIsSubmitting(true);

    try {
      if (transaction) {
        await TransactionService.updateTransaction(
          walletId,
          transaction.id,
          data
        );
        toast.success('Transação atualizada com sucesso!');
      } else {
        await TransactionService.createTransaction(walletId, data);
        toast.success('Transação registrada com sucesso!');
      }
      setFields(freshValues());
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
              {isEditing ? 'Editar transação' : 'Nova transação'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Altere os dados do lançamento.'
                : 'Registre uma entrada ou saída nesta carteira.'}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel>Tipo</FieldLabel>
              <ToggleGroup
                type="single"
                variant="outline"
                spacing={0}
                className="w-full"
                value={fields.type}
                onValueChange={handleTypeChange}
              >
                <ToggleGroupItem
                  value="EXPENSE"
                  className="flex-1 data-[state=on]:text-expense"
                >
                  Saída
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="INCOME"
                  className="flex-1 data-[state=on]:text-income"
                >
                  Entrada
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="value">Valor</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>R$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  type="number"
                  id="value"
                  name="value"
                  step="0.01"
                  min="0.01"
                  inputMode="decimal"
                  placeholder="0,00"
                  aria-invalid={!!fieldErrors.value}
                  value={fields.value}
                  onChange={handleChange}
                />
              </InputGroup>
              <FieldError
                errors={
                  fieldErrors.value ? [{ message: fieldErrors.value }] : []
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="date">Data</FieldLabel>
              <Popover
                open={isCalendarOpen}
                onOpenChange={setIsCalendarOpen}
                modal
              >
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    type="button"
                    variant="outline"
                    className="w-full justify-start font-normal"
                    aria-invalid={!!fieldErrors.date}
                  >
                    <CalendarIcon />
                    {fields.date
                      ? formatLongDate(parseLocalDate(fields.date))
                      : 'Selecione uma data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    locale={ptBR}
                    selected={
                      fields.date ? parseLocalDate(fields.date) : undefined
                    }
                    defaultMonth={
                      fields.date ? parseLocalDate(fields.date) : undefined
                    }
                    disabled={{ after: new Date() }}
                    onSelect={handleDateSelect}
                  />
                </PopoverContent>
              </Popover>
              <FieldError
                errors={fieldErrors.date ? [{ message: fieldErrors.date }] : []}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="category">Categoria</FieldLabel>
              <CategoryCombobox
                id="category"
                walletId={walletId}
                type={fields.type}
                categories={categories.filter(
                  (c) => c.transactionType === fields.type
                )}
                value={fields.categoryId}
                onChange={(categoryId) =>
                  setFields((prev) => ({ ...prev, categoryId }))
                }
                onCreated={onCategoryCreated}
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
                  ? 'Registrando...'
                  : 'Registrar transação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
