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
import WalletMemberService from '@/services/WalletMemberService.ts';
import { toast } from 'sonner';
import { toastApiError } from '@/lib/apiErrors.ts';

interface LeaveWalletDialogProps {
  wallet: ApiWalletListingDTO | null;
  userId: number;
  onOpenChange: (open: boolean) => void;
  onLeft: () => void;
}

export const LeaveWalletDialog = ({
  wallet,
  userId,
  onOpenChange,
  onLeft,
}: LeaveWalletDialogProps) => {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isLeaving) return;

    onOpenChange(nextOpen);
  };

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!wallet) return;
    setIsLeaving(true);

    try {
      await WalletMemberService.removeMember(wallet.id, userId);

      toast.success('Você saiu da carteira');
      onLeft();
      onOpenChange(false);
    } catch (e) {
      toastApiError(e);
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <AlertDialog open={wallet !== null} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sair da carteira</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja sair da carteira <b>{wallet?.name}</b>? Você perderá o acesso
            a ela, mas as transações que você registrou continuarão lá.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLeaving}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isLeaving}
            onClick={handleConfirm}
          >
            {isLeaving ? 'Saindo...' : 'Sair'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
