import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatMonth, formatDateTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import WalletService from '@/services/WalletService';
import type {
  ApiRecentTransactionDTO,
  ApiWalletListingDTO,
} from '@/services/types';
import { useCurrentUser } from '@/hooks/useCurrentUser.ts';
import { useCallback, useEffect, useState } from 'react';
import { toastApiError } from '@/lib/apiErrors.ts';
import { Button } from '@/components/ui/button.tsx';
import { MoreHorizontal, Pencil, Plus, Share2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty.tsx';
import { MemberAvatars } from '@/components/MemberAvatars.tsx';
import { WalletFormDialog } from '@/components/wallet/WalletFormDialog.tsx';
import { DeleteWalletDialog } from '@/components/wallet/DeleteWalletDialog.tsx';
import { ShareWalletDialog } from '@/components/wallet/ShareWalletDialog.tsx';
import { WalletBalanceSummary } from '@/components/wallet/WalletBalanceSummary.tsx';
import { Link } from 'react-router-dom';

const DashboardSkeleton = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="h-12 w-72" />
    <div className="grid gap-4 md:grid-cols-2">
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
    </div>
    <Skeleton className="h-64" />
  </div>
);

interface WalletOverviewProps {
  wallet: ApiWalletListingDTO;
  isOwner: boolean;
  monthName: string;
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const WalletOverview = ({
  wallet,
  isOwner,
  monthName,
  onShare,
  onEdit,
  onDelete,
}: WalletOverviewProps) => {
  return (
    <article className="group relative flex flex-col gap-3 border-b py-5 md:odd:pr-6 md:even:pl-6 md:odd:not-last:border-r md:odd:last:col-span-2 md:odd:last:pr-0">
      <header className="flex items-baseline justify-between gap-4">
        <h3 className="truncate font-bold group-hover:underline">
          {/* Link "esticado": o ::after cobre o bloco todo e deixa ele clicável
              sem botão dentro de <a> (HTML inválido). Menu e avatares ficam
              por cima com z-10 pra continuarem respondendo */}
          <Link
            to={`/app/carteiras/${wallet.id}`}
            className="after:absolute after:inset-0"
          >
            {wallet.name}
          </Link>
        </h3>
        {/* Todas as ações são de dono, quem só participa vê a etiqueta no lugar */}
        {isOwner ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                className="relative z-10"
                variant="ghost"
                size="icon-sm"
                aria-label={`Ações da carteira ${wallet.name}`}
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={onShare}>
                <Share2 /> Compartilhar
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onEdit}>
                <Pencil /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={onDelete}>
                <Trash2 /> Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span className="shrink-0 text-xs tracking-wider uppercase">
            carteira compartilhada
          </span>
        )}
      </header>

      <WalletBalanceSummary wallet={wallet} monthName={monthName} />

      {wallet.members.length > 1 && (
        <div className="relative z-10 w-fit">
          <MemberAvatars members={wallet.members} />
        </div>
      )}
    </article>
  );
};

export const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<ApiRecentTransactionDTO[]>(
    []
  );
  const [wallets, setWallets] = useState<ApiWalletListingDTO[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [walletToEdit, setWalletToEdit] = useState<ApiWalletListingDTO | null>(
    null
  );
  const [walletToDelete, setWalletToDelete] =
    useState<ApiWalletListingDTO | null>(null);
  const [walletToShare, setWalletToShare] =
    useState<ApiWalletListingDTO | null>(null);

  const user = useCurrentUser();
  const monthName = formatMonth(new Date());

  const loadDashboard = useCallback(async () => {
    try {
      const [recentTransactions, userWallets] = await Promise.all([
        WalletService.getRecentTransactions(),
        WalletService.getWallets(),
      ]);

      setTransactions(recentTransactions);
      setWallets(userWallets);
    } catch (err) {
      toastApiError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadOnMount = async () => {
      await loadDashboard();
    };

    loadOnMount();
  }, [loadDashboard]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-6">
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <section className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Suas carteiras no mês de <b>{monthName}</b>
                </p>
              </div>

              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus /> Criar carteira
              </Button>
            </div>

            {wallets.length === 0 ? (
              <Empty className="border-y">
                <EmptyHeader>
                  <EmptyTitle>Nenhuma carteira ainda</EmptyTitle>
                  <EmptyDescription>
                    Clique em <b>"+ Criar carteira"</b> para começar a organizar
                    suas despesas.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="grid grid-cols-1 border-t md:grid-cols-2">
                {wallets.map((wallet) => (
                  <WalletOverview
                    key={wallet.id}
                    wallet={wallet}
                    isOwner={!!user && wallet.ownerId === user.id}
                    monthName={monthName}
                    onShare={() => setWalletToShare(wallet)}
                    onEdit={() => setWalletToEdit(wallet)}
                    onDelete={() => setWalletToDelete(wallet)}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-4 pt-6">
            <div>
              <h2 className="text-lg font-extrabold">Lançamentos recentes</h2>
              <p className="text-sm text-muted-foreground">
                Últimas movimentações de todas as suas carteiras
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Carteira
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Categoria
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Nenhum lançamento ainda
                    </TableCell>
                  </TableRow>
                )}
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {transaction.description || '-'}
                      <span className="block text-xs text-muted-foreground md:hidden">
                        {transaction.walletName} ·{' '}
                        {formatDateTime(transaction.date)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {transaction.walletName}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {transaction.categoryName ? (
                        <span className="flex items-center gap-2">
                          <span
                            className="size-2 rounded-full"
                            style={{
                              backgroundColor: `#${transaction.categoryColor}`,
                            }}
                          />
                          {transaction.categoryName}
                        </span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {formatDateTime(transaction.date)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-medium',
                        transaction.type === 'INCOME'
                          ? 'text-income'
                          : 'text-expense'
                      )}
                    >
                      {transaction.type === 'INCOME' ? '+ ' : '- '}
                      {formatCurrency(transaction.value)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </>
      )}

      <WalletFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSaved={loadDashboard}
      />

      <WalletFormDialog
        key={walletToEdit?.id ?? 'fechado'}
        open={walletToEdit !== null}
        wallet={walletToEdit}
        onOpenChange={(open) => !open && setWalletToEdit(null)}
        onSaved={loadDashboard}
      />

      <DeleteWalletDialog
        wallet={walletToDelete}
        onOpenChange={(open) => !open && setWalletToDelete(null)}
        onDeleted={loadDashboard}
      />

      <ShareWalletDialog
        wallet={walletToShare}
        onOpenChange={(open) => !open && setWalletToShare(null)}
        onChanged={loadDashboard}
      />
    </main>
  );
};
