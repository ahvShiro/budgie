import type { ApiWalletListingDTO } from '@/services/types.ts';
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
import WalletService from '@/services/WalletService.ts';
import { toast } from 'sonner';
import { toastApiError } from '@/lib/apiErrors.ts';

interface DeleteWalletDialogProps {
  wallet: ApiWalletListingDTO | null;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export const DeleteWalletDialog = ({
  wallet,
  onOpenChange,
  onDeleted,
}: DeleteWalletDialogProps) => {
  const [isDeleteing, setIsDeleting] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isDeleteing) return;

    onOpenChange(nextOpen);
  };

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!wallet) return;
    setIsDeleting(true);

    try {
      await WalletService.deleteWallet(wallet.id);

      toast.success('Carteira deletada com sucesso!');
      onDeleted();
      onOpenChange(false);
    } catch (e) {
      toastApiError(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={wallet !== null} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar carteira</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja deletar a carteira <b>{wallet?.name}</b> e todas as suas
            transações?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleteing}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeleteing}
            onClick={handleConfirm}
          >
            {isDeleteing ? 'Deletando...' : 'Deletar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
