import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx';
import { formatCurrency, getInitial } from '@/lib/formatters.ts';
import { Button } from '@/components/ui/button.tsx';
import { MoreHorizontal, Pencil, Plus, Share2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import type { ApiWalletListingDTO } from '@/services/types.ts';
import { useCallback, useEffect, useState } from 'react';
import { toastApiError } from '@/lib/apiErrors.ts';
import WalletService from '@/services/WalletService.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { WalletFormDialog } from '@/components/wallet/WalletFormDialog.tsx';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty.tsx';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from '@/components/ui/avatar.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import { DeleteWalletDialog } from '@/components/wallet/DeleteWalletDialog.tsx';
import { ShareWalletDialog } from '@/components/wallet/ShareWalletDialog.tsx';
import { useCurrentUser } from '@/hooks/useCurrentUser.ts';

const SKELETON_ROWS = [0, 1, 2, 3, 4];
const MAX_AVATARS = 3;

export const WalletListing = () => {
  const [wallets, setWallets] = useState<ApiWalletListingDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [walletToEdit, setWalletToEdit] = useState<ApiWalletListingDTO | null>(
    null
  );
  const [walletToDelete, setWalletToDelete] =
    useState<ApiWalletListingDTO | null>(null);
  const [walletToShare, setWalletToShare] =
    useState<ApiWalletListingDTO | null>(null);
  const user = useCurrentUser();

  // Fora do useEffect pq o modal reusa pra recarregar depois de criar.
  // isLoading só começa true, então o refetch não pisca o skeleton
  const loadWallets = useCallback(async () => {
    try {
      setWallets(await WalletService.getWallets());
    } catch (err) {
      toastApiError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadOnMount = async () => {
      await loadWallets();
    };

    loadOnMount();
  }, [loadWallets]);

  return (
    <div>
      <main className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex justify-between">
          <h1 className="flex flex-col gap-1 text-3xl font-extrabold">
            Suas carteiras
          </h1>

          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus /> Criar carteira nova
          </Button>
        </div>

        <div className="flex flex-col">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-60">Nome</TableHead>
                <TableHead className="w-160">Descrição</TableHead>
                <TableHead className="w-30">Membros</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-px text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                SKELETON_ROWS.map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading &&
                wallets.map((wallet) => (
                  <TableRow key={wallet.id}>
                    <TableCell className="font-medium">{wallet.name}</TableCell>
                    <TableCell>{wallet.description || '—'}</TableCell>
                    <TableCell>
                      <AvatarGroup>
                        {/* Se o objeto futuramente trazer o ID também, dá pra colocar na key */}
                        {/* Cpa que da pra componentizar isso, mas tem que ver onde mais usaria esse elemento de vários usuários*/}
                        {wallet.members
                          .slice(0, MAX_AVATARS)
                          .map((member, i) => (
                            <Tooltip key={i}>
                              <TooltipTrigger asChild>
                                <Avatar className="size-6">
                                  <AvatarFallback>
                                    {getInitial(member)}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>{member}</TooltipContent>
                            </Tooltip>
                          ))}
                        {wallet.members.length > MAX_AVATARS && (
                          <AvatarGroupCount className="size-6 text-xs">
                            +{wallet.members.length - MAX_AVATARS}
                          </AvatarGroupCount>
                        )}
                      </AvatarGroup>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(wallet.balance)}
                    </TableCell>
                    <TableCell className="w-px text-center">
                      {/* Todas as ações são de dono, membro comum não vê o menu */}
                      {wallet.ownerId === user?.id && (
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon-sm"
                              aria-label={`Ações da carteira ${wallet.name}`}
                            >
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => setWalletToShare(wallet)}
                            >
                              <Share2 /> Compartilhar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => setWalletToEdit(wallet)}
                            >
                              <Pencil /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={() => setWalletToDelete(wallet)}
                            >
                              <Trash2 /> Deletar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && wallets.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5}>
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>Nenhuma carteira ainda</EmptyTitle>
                        <EmptyDescription>
                          Clique no botão <b>"+ Criar carteira nova"</b> para
                          criar carteiras para gestão de despesas.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      <WalletFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSaved={loadWallets}
      />

      <WalletFormDialog
        key={walletToEdit?.id ?? 'fechado'}
        open={walletToEdit !== null}
        wallet={walletToEdit}
        onOpenChange={(open) => !open && setWalletToEdit(null)}
        onSaved={loadWallets}
      />

      <DeleteWalletDialog
        wallet={walletToDelete}
        onOpenChange={(open) => !open && setWalletToDelete(null)}
        onDeleted={loadWallets}
      />

      <ShareWalletDialog
        wallet={walletToShare}
        onOpenChange={(open) => !open && setWalletToShare(null)}
        onChanged={loadWallets}
      />
    </div>
  );
};
