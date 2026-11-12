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
import { Badge } from '@/components/ui/badge.tsx';
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
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toastApiError } from '@/lib/apiErrors.ts';
import { formatCurrency, formatShortDate } from '@/lib/formatters.ts';
import { cn } from '@/lib/utils.ts';
import WalletService from '@/services/WalletService.ts';
import TransactionService from '@/services/TransactionService.ts';
import type {
  ApiPageDTO,
  ApiTransactionResponseDTO,
  ApiWalletListingDTO,
} from '@/services/types.ts';

const SKELETON_ROWS = [0, 1, 2, 3, 4];
const PAGE_SIZE = 20;
const SORT = 'date,desc';

export const TransactionListing = () => {
  const [wallets, setWallets] = useState<ApiWalletListingDTO[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);
  const [transactions, setTransactions] =
    useState<ApiPageDTO<ApiTransactionResponseDTO> | null>(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // const [transactionToEdit, setTransactionToEdit] = useState();
  // const [transactionToDelete, setTransactionToDelete] = useState();
  // const [isCreateOpen, setIsCreateOpen] = useState(false);

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

          {/*<Button onClick={() => setIsCreateOpen(true)}>*/}
          {/*  <Plus /> Registrar transação*/}
          {/*</Button>*/}
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
                rows.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatShortDate(transaction.date)}</TableCell>
                    <TableCell className="font-medium">
                      {transaction.description || '—'}
                    </TableCell>
                    {/* TODO trocar pelo nome qdo existir o CategoryService no front */}
                    <TableCell>{transaction.categoryId ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {transaction.type === 'INCOME' ? 'Entrada' : 'Saída'}
                      </Badge>
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
                  </TableRow>
                ))}

              {!isLoading && rows.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5}>
                    <Empty>
                      <EmptyHeader>
                        {wallets.length === 0 ? (
                          <>
                            <EmptyTitle>Nenhuma carteira ainda</EmptyTitle>
                            <EmptyDescription>
                              Crie uma carteira na tela de <b>Carteiras</b>{' '}
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
    </div>
  );
};
