import type { ApiCategoryResponseDTO } from '@/services/types.ts';
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
import CategoryService from '@/services/CategoryService.ts';
import { toast } from 'sonner';
import { toastApiError } from '@/lib/apiErrors.ts';

interface DeleteCategoryDialogProps {
  walletId: number;
  category: ApiCategoryResponseDTO | null;
  onOpenChange: (open: boolean) => void;
  onDeleted: (category: ApiCategoryResponseDTO) => void;
}

export const DeleteCategoryDialog = ({
  walletId,
  category,
  onOpenChange,
  onDeleted,
}: DeleteCategoryDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isDeleting) return;

    onOpenChange(nextOpen);
  };

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!category) return;
    setIsDeleting(true);

    try {
      await CategoryService.deleteCategory(walletId, category.id);

      toast.success('Categoria deletada com sucesso!');
      onDeleted(category);
      onOpenChange(false);
    } catch (e) {
      toastApiError(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={category !== null} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar categoria</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja deletar a categoria <b>{category?.name}</b>? As transações
            associadas a ela não serão deletadas, mas ficarão sem categoria.
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
