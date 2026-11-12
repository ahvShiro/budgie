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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Plus,
} from 'lucide-react';
import { toastApiError } from '@/lib/apiErrors.ts';
import { formatCurrency, formatShortDate } from '@/lib/formatters.ts';
import { cn } from '@/lib/utils.ts';
import WalletService from '@/services/WalletService.ts';
import TransactionService from '@/services/TransactionService.ts';
import CategoryService from '@/services/CategoryService.ts';
import type {
  ApiCategoryResponseDTO,
  ApiPageDTO,
  ApiTransactionResponseDTO,
  ApiWalletListingDTO,
} from '@/services/types.ts';
import { Link } from 'react-router-dom';

const SKELETON_ROWS = [0, 1, 2, 3, 4];
const PAGE_SIZE = 20;
const SORT = 'date,desc';

interface CategoryCellProps {
  category?: ApiCategoryResponseDTO;
}

const CategoryCell = ({ category }: CategoryCellProps) => {
  if (!category) return '—';

  return (
    <span className="flex items-center gap-2">
      <CategoryDot color={category.color} />
      {category.name}
    </span>
  );
};

export const TransactionListing = () => {
  const [wallets, setWallets] = useState<ApiWalletListingDTO[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);
  const [transactions, setTransactions] =
    useState<ApiPageDTO<ApiTransactionResponseDTO> | null>(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [categories, setCategories] = useState<ApiCategoryResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<ApiTransactionResponseDTO | null>(null);
  // const [transactionToDelete, setTransactionToDelete] = useState();

  // Map pra tabela achar a categoria de cada linha sem fazer find() por linha
  const categoriesById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const data = await WalletService.getWallets();
        setWallets(data);
        if (data.length > 0) setSelectedWalletId(data[0].id);
        else setIsLoading(false);
      } catch (err) {
        toastApiError(err);
        setIsLoading(false);
      }
    };

    loadWallets();
  }, []);

  const loadTransactions = useCallback(
    async (walletId: number, page: number) => {
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
        toastApiError(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (selectedWalletId === null) return;

    const loadOnChange = async () => {
      await loadTransactions(selectedWalletId, pageNumber);
    };

    loadOnChange();
  }, [selectedWalletId, pageNumber, loadTransactions]);

  // Busca todas as categorias da carteira de uma vez, sem filtro de tipo.
  // O modal filtra no cliente, aí trocar Entrada/Saída não faz request
  useEffect(() => {
    if (selectedWalletId === null) return;

    const loadCategories = async () => {
      try {
        setCategories(await CategoryService.getCategories(selectedWalletId));
      } catch (err) {
        toastApiError(err);
      }
    };

    loadCategories();
  }, [selectedWalletId]);

  // Categoria criada no combobox entra na lista local, sem refetch
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
    if (selectedWalletId !== null) {
      loadTransactions(selectedWalletId, pageNumber);
    }
  };

  const handleWalletChange = (value: string) => {
    setSelectedWalletId(Number(value));
    setPageNumber(0);
  };

  const rows = transactions?.content ?? [];

  return (
    <div>
      <main className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex justify-between">
          <h1 className="flex flex-col gap-1 text-3xl font-extrabold">
            Suas transações
          </h1>

          <Button
            onClick={() => setIsCreateOpen(true)}
            disabled={selectedWalletId === null}
          >
            <Plus /> Registrar transação
          </Button>
        </div>

        {wallets.length > 0 && (
          <Select
            value={selectedWalletId?.toString()}
            onValueChange={handleWalletChange}
          >
            <SelectTrigger className="w-60" aria-label="Carteira">
              <SelectValue placeholder="Selecione uma carteira" />
            </SelectTrigger>
            <SelectContent>
              {wallets.map((wallet) => (
                <SelectItem key={wallet.id} value={wallet.id.toString()}>
                  {wallet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex flex-col">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="w-40">Categoria</TableHead>
                <TableHead className="w-24">Tipo</TableHead>
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
                    <TableCell>{formatShortDate(transaction.date)}</TableCell>
                    <TableCell className="font-medium">
                      {transaction.description || '—'}
                    </TableCell>
                    <TableCell>
                      <CategoryCell
                        category={
                          transaction.categoryId !== null
                            ? categoriesById.get(transaction.categoryId)
                            : undefined
                        }
                      />
                    </TableCell>
                    <TableCell>
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && rows.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6}>
                    <Empty>
                      <EmptyHeader>
                        {wallets.length === 0 ? (
                          <>
                            <EmptyTitle>Nenhuma carteira ainda</EmptyTitle>
                            <EmptyDescription>
                              Crie uma carteira na tela de{' '}
                              <b className={'underline'}>
                                <Link to="/app/carteiras">Carteiras</Link>
                              </b>{' '}
                              antes de registrar transações.
                            </EmptyDescription>
                          </>
                        ) : (
                          <>
                            <EmptyTitle>Nenhuma transação ainda</EmptyTitle>
                            <EmptyDescription>
                              Essa carteira ainda não tem nenhuma transação
                              registrada.
                            </EmptyDescription>
                          </>
                        )}
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

      {selectedWalletId !== null && (
        <>
          <TransactionFormDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            onSaved={handleSaved}
            walletId={selectedWalletId}
            categories={categories}
            onCategoryCreated={handleCategoryCreated}
            onCategoryUpdated={handleCategoryUpdated}
            onCategoryDeleted={handleCategoryDeleted}
          />

          <TransactionFormDialog
            key={transactionToEdit?.id ?? 'fechado'}
            open={transactionToEdit !== null}
            transaction={transactionToEdit}
            onOpenChange={(open) => !open && setTransactionToEdit(null)}
            onSaved={handleSaved}
            walletId={selectedWalletId}
            categories={categories}
            onCategoryCreated={handleCategoryCreated}
            onCategoryUpdated={handleCategoryUpdated}
            onCategoryDeleted={handleCategoryDeleted}
          />
        </>
      )}
    </div>
  );
};
