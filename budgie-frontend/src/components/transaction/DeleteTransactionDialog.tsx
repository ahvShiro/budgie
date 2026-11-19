import type { ApiTransactionResponseDTO } from '@/services/types.ts';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx';
import TransactionService from '@/services/TransactionService.ts';
import { toast } from 'sonner';
import { toastApiError } from '@/lib/apiErrors.ts';
import { formatCurrency, formatDateTime } from '@/lib/formatters.ts';

interface DeleteTransactionDialogProps {
  walletId: number;
  transaction: ApiTransactionResponseDTO | null;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export const DeleteTransactionDialog = ({
  walletId,
  transaction,
  onOpenChange,
  onDeleted,
}: DeleteTransactionDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isDeleting) return;

    onOpenChange(nextOpen);
  };

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!transaction) return;
    setIsDeleting(true);

    try {
      await TransactionService.deleteTransaction(walletId, transaction.id);

      toast.success('Transação deletada com sucesso!');
      onDeleted();
      onOpenChange(false);
    } catch (e) {
      toastApiError(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={transaction !== null} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar transação</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja deletar a transação{' '}
            <b>{transaction?.description || 'sem descrição'}</b> de{' '}
            <b>{transaction && formatCurrency(transaction.value)}</b> em{' '}
            {transaction && formatDateTime(transaction.date)}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeleting}
            onClick={handleConfirm}
          >
            {isDeleting ? 'Deletando...' : 'Deletar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
