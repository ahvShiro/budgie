import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { CategoryDot } from '@/components/category/CategoryCombobox.tsx';
import { TransactionFormDialog } from '@/components/transaction/TransactionFormDialog.tsx';
import { WalletFormDialog } from '@/components/wallet/WalletFormDialog.tsx';
import { DeleteWalletDialog } from '@/components/wallet/DeleteWalletDialog.tsx';
import { LeaveWalletDialog } from '@/components/wallet/LeaveWalletDialog.tsx';
import { DeleteTransactionDialog } from '@/components/transaction/DeleteTransactionDialog.tsx';
import { ShareWalletDialog } from '@/components/wallet/ShareWalletDialog.tsx';
import { useCurrentUser } from '@/hooks/useCurrentUser.ts';
import { MemberAvatars } from '@/components/MemberAvatars.tsx';
import { WalletBalanceSummary } from '@/components/wallet/WalletBalanceSummary.tsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Plus,
  Share2,
  LogOut,
  Trash2,
} from 'lucide-react';
import { toastApiError } from '@/lib/apiErrors.ts';
import {
  formatCurrency,
  formatDateTime,
  formatMonth,
} from '@/lib/formatters.ts';
import { cn } from '@/lib/utils.ts';
import TransactionService from '@/services/TransactionService.ts';
import CategoryService from '@/services/CategoryService.ts';
import type {
  ApiCategoryResponseDTO,
  ApiPageDTO,
  ApiErrorMessage,
  ApiTransactionResponseDTO,
  ApiWalletListingDTO,
} from '@/services/types.ts';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import WalletService from '@/services/WalletService.ts';

const SKELETON_ROWS = [0, 1, 2, 3, 4];
const PAGE_SIZE = 20;
const SORT = 'date,desc';
// Id inválido (400), carteira apagada (404) ou de outra pessoa (403)
const WALLET_UNAVAILABLE_STATUS = [400, 403, 404];

interface CategoryCellProps {
  category?: ApiCategoryResponseDTO;
}

const CategoryCell = ({ category }: CategoryCellProps) => {
  if (!category) return '-';

  return (
    <span className="flex items-center gap-2">
      <CategoryDot color={category.color} />
      {category.name}
    </span>
  );
};

export const TransactionListing = () => {
  const { walletId } = useParams();

  return <WalletTransactions key={walletId} walletId={Number(walletId)} />;
};

interface WalletTransactionsProps {
  walletId: number;
}

const WalletTransactions = ({ walletId }: WalletTransactionsProps) => {
  const [transactions, setTransactions] =
    useState<ApiPageDTO<ApiTransactionResponseDTO> | null>(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [categories, setCategories] = useState<ApiCategoryResponseDTO[]>([]);
  const [walletInfo, setWalletInfo] = useState<ApiWalletListingDTO | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<ApiTransactionResponseDTO | null>(null);
  const [transactionToDelete, setTransactionToDelete] =
    useState<ApiTransactionResponseDTO | null>(null);
  const [isWalletEditOpen, setIsWalletEditOpen] = useState(false);
  const [isWalletShareOpen, setIsWalletShareOpen] = useState(false);
  const [isWalletDeleteOpen, setIsWalletDeleteOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);

  const user = useCurrentUser();
  const isOwner = !!user && walletInfo?.ownerId === user.id;
  const role = walletInfo?.role;
  const canCreate = role === 'OWNER' || role === 'EDITOR';
  const canModify = (transaction: ApiTransactionResponseDTO) =>
    role === 'OWNER' ||
    (role === 'EDITOR' && transaction.createdById === user?.id);

  const categoriesById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const navigate = useNavigate();

  const handleLoadError = useCallback(
    (err: unknown) => {
      if (
        axios.isAxiosError<ApiErrorMessage>(err) &&
        err.response &&
        WALLET_UNAVAILABLE_STATUS.includes(err.response.status)
      ) {
        toast.error(err.response.data.message, { id: 'carteira-indisponivel' });
        navigate('/app/dashboard', { replace: true });
      } else {
        toastApiError(err);
      }
    },
    [navigate]
  );

  const loadTransactions = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        setTransactions(
          await TransactionService.getTransactions(walletId, {
            page,
            size: PAGE_SIZE,
            sort: SORT,
          })
        );
      } catch (err) {
        handleLoadError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [walletId, handleLoadError]
  );

  useEffect(() => {
    const loadOnChange = async () => {
      await loadTransactions(pageNumber);
    };

    loadOnChange();
  }, [pageNumber, loadTransactions]);

  useEffect(() => {
    const loadWalletData = async () => {
      try {
        const [walletData, categories] = await Promise.all([
          WalletService.getWallet(walletId),
          CategoryService.getCategories(walletId),
        ]);
        setWalletInfo(walletData);
        setCategories(categories);
      } catch (e) {
        handleLoadError(e);
      }
    };

    loadWalletData();
  }, [walletId, handleLoadError]);

  const handleCategoryCreated = (category: ApiCategoryResponseDTO) => {
    setCategories((prev) => [...prev, category]);
  };

  const handleCategoryUpdated = (category: ApiCategoryResponseDTO) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? category : c))
    );
  };

  const handleCategoryDeleted = (category: ApiCategoryResponseDTO) => {
    setCategories((prev) => prev.filter((c) => c.id !== category.id));
  };

  const handleSaved = () => {
    loadTransactions(pageNumber);
    reloadWallet();
  };

  const handleTransactionDeleted = () => {
    if (rows.length === 1 && pageNumber > 0) {
      setPageNumber((p) => p - 1);
    } else {
      loadTransactions(pageNumber);
    }
    reloadWallet();
  };

  const reloadWallet = async () => {
    try {
      setWalletInfo(await WalletService.getWallet(walletId));
    } catch (err) {
      handleLoadError(err);
    }
  };

  const rows = transactions?.content ?? [];

  return (
    <div>
      <main className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
          <div>
            <h1 className="flex flex-col gap-1 text-3xl font-extrabold">
              {walletInfo ? walletInfo.name : <Skeleton className="h-9 w-64" />}
            </h1>
            {walletInfo ? (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MemberAvatars members={walletInfo.members} />
                <span>
                  {walletInfo.members.length}{' '}
                  {walletInfo.members.length === 1 ? 'membro' : 'membros'}
                </span>
              </div>
            ) : (
              <Skeleton className="mt-2 h-6 w-32" />
            )}
          </div>

          <div className="flex flex-wrap items-start gap-2">
            {isOwner && (
              <>
                <Button
                  variant="outline"
                  aria-label="Compartilhar carteira"
                  onClick={() => setIsWalletShareOpen(true)}
                >
                  <Share2 />{' '}
                  <span className="hidden lg:inline">Compartilhar</span>
                </Button>
                <Button
                  variant="outline"
                  aria-label="Editar carteira"
                  onClick={() => setIsWalletEditOpen(true)}
                >
                  <Pencil /> <span className="hidden lg:inline">Editar</span>
                </Button>
                <Button
                  variant="destructive"
                  aria-label="Deletar carteira"
                  onClick={() => setIsWalletDeleteOpen(true)}
                >
                  <Trash2 /> <span className="hidden lg:inline">Deletar</span>
                </Button>
              </>
            )}

            {walletInfo && !isOwner && (
              <Button
                variant="outline"
                aria-label="Sair da carteira"
                onClick={() => setIsLeaveOpen(true)}
              >
                <LogOut />{' '}
                <span className="hidden lg:inline">Sair da carteira</span>
              </Button>
            )}

            {canCreate && (
              <Button
                className="ml-auto lg:ml-0"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus /> Registrar transação
              </Button>
            )}
          </div>
        </div>

        <section className="flex flex-col gap-3 border-y py-5">
          <h2 className="text-xs tracking-wider text-muted-foreground uppercase">
            Saldo da carteira
          </h2>
          {walletInfo ? (
            <WalletBalanceSummary
              wallet={walletInfo}
              monthName={formatMonth(new Date())}
            />
          ) : (
            <Skeleton className="h-20 w-full" />
          )}
        </section>

        <div className="flex flex-col">
          <Table>
            <TableHeader>
              <TableRow>
                {/* hidden = mobile */}
                <TableHead className="hidden w-40 md:table-cell">
                  Data
                </TableHead>
                <TableHead>Descrição</TableHead>

                {/* hidden = mobile */}
                <TableHead className="hidden w-40 md:table-cell">
                  Categoria
                </TableHead>

                {/* hidden = mobile */}
                <TableHead className="hidden w-24 md:table-cell">
                  Tipo
                </TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-px text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                SKELETON_ROWS.map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading &&
                rows.map((transaction) => (
                  <TableRow key={transaction.id}>
                    {/* mobile */}
                    <TableCell className="hidden md:table-cell">
                      {formatDateTime(transaction.date)}
                    </TableCell>

                    <TableCell className="font-medium">
                      {transaction.description || '-'}
                      <span className="block text-xs font-normal text-muted-foreground md:hidden">
                        {transaction.categoryId !== null &&
                          `${categoriesById.get(transaction.categoryId)?.name ?? ''} · `}
                        {formatDateTime(transaction.date)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <CategoryCell
                        category={
                          transaction.categoryId !== null
                            ? categoriesById.get(transaction.categoryId)
                            : undefined
                        }
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {transaction.type === 'INCOME' ? 'Entrada' : 'Saída'}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right',
                        transaction.type === 'INCOME'
                          ? 'text-income'
                          : 'text-expense'
                      )}
                    >
                      {formatCurrency(transaction.value)}
                    </TableCell>
                    <TableCell className="w-px text-center">
                      {canModify(transaction) && (
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon-sm"
                              aria-label="Ações da transação"
                            >
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => setTransactionToEdit(transaction)}
                            >
                              <Pencil /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={() =>
                                setTransactionToDelete(transaction)
                              }
                            >
                              <Trash2 /> Deletar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && rows.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6}>
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>Nenhuma transação ainda</EmptyTitle>
                        <EmptyDescription>
                          Essa carteira ainda não tem nenhuma transação
                          registrada.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {transactions && transactions.totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 pt-4">
              <span className="text-sm text-muted-foreground">
                Página {transactions.number + 1} de {transactions.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Página anterior"
                disabled={isLoading || transactions.first}
                onClick={() => setPageNumber((p) => p - 1)}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Próxima página"
                disabled={isLoading || transactions.last}
                onClick={() => setPageNumber((p) => p + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          )}
        </div>
      </main>

      <TransactionFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSaved={handleSaved}
        walletId={walletId}
        categories={categories}
        onCategoryCreated={handleCategoryCreated}
        onCategoryUpdated={handleCategoryUpdated}
        onCategoryDeleted={handleCategoryDeleted}
        canManageCategories={isOwner}
      />

      <TransactionFormDialog
        key={transactionToEdit?.id ?? 'fechado'}
        open={transactionToEdit !== null}
        transaction={transactionToEdit}
        onOpenChange={(open) => !open && setTransactionToEdit(null)}
        onSaved={handleSaved}
        walletId={walletId}
        categories={categories}
        onCategoryCreated={handleCategoryCreated}
        onCategoryUpdated={handleCategoryUpdated}
        onCategoryDeleted={handleCategoryDeleted}
        canManageCategories={isOwner}
      />

      <WalletFormDialog
        key={
          isWalletEditOpen ? `carteira-${walletInfo?.id}` : 'carteira-fechado'
        }
        open={isWalletEditOpen}
        wallet={walletInfo}
        onOpenChange={setIsWalletEditOpen}
        onSaved={reloadWallet}
      />

      <ShareWalletDialog
        wallet={isWalletShareOpen ? walletInfo : null}
        onOpenChange={setIsWalletShareOpen}
        onChanged={reloadWallet}
      />

      {user && (
        <LeaveWalletDialog
          wallet={isLeaveOpen ? walletInfo : null}
          userId={user.id}
          onOpenChange={setIsLeaveOpen}
          onLeft={() => navigate('/app/dashboard', { replace: true })}
        />
      )}

      <DeleteWalletDialog
        wallet={isWalletDeleteOpen ? walletInfo : null}
        onOpenChange={setIsWalletDeleteOpen}
        onDeleted={() => navigate('/app/dashboard', { replace: true })}
      />

      <DeleteTransactionDialog
        walletId={walletId}
        transaction={transactionToDelete}
        onOpenChange={(open) => !open && setTransactionToDelete(null)}
        onDeleted={handleTransactionDeleted}
      />
    </div>
  );
};
