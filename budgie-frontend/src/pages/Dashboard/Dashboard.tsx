import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatShortDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import WalletService from '@/services/WalletService';
import type { ApiRecentTransactionDTO } from '@/services/types';
import { useEffect, useState } from 'react';
import { toastApiError } from '@/lib/apiErrors.ts';
import { Button } from '@/components/ui/button.tsx';
import { WalletIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardSkeleton = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="h-16 w-72" />
    <div className="grid gap-4 sm:grid-cols-3">
      <Skeleton className="h-14" />
      <Skeleton className="h-14" />
      <Skeleton className="h-14" />
    </div>
    <Skeleton className="h-72" />
    <Skeleton className="h-64" />
  </div>
);

export const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<ApiRecentTransactionDTO[]>(
    []
  );

  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [total, recentTransactions] = await Promise.all([
          WalletService.getTotalBalance(),
          WalletService.getRecentTransactions(),
        ]);

        setTotalBalance(total.balance);
        setTransactions(recentTransactions);
      } catch (err) {
        toastApiError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-6">
      {isLoading || totalBalance === null ? (
        <DashboardSkeleton />
      ) : (
        <>
          <h1 className="flex flex-col gap-1">
            <span className="text-sm font-normal text-muted-foreground">
              Saldo total das suas carteiras
            </span>
            <span className="text-4xl font-extrabold sm:text-6xl">
              {formatCurrency(totalBalance)}
            </span>
          </h1>

          <Separator />

          <section className="flex flex-col gap-4 pt-6">
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-extrabold">Lançamentos recentes</h2>
                <p className="text-sm text-muted-foreground">
                  Últimas movimentações de todas as suas carteiras
                </p>
              </div>

              <Button
                onClick={() => {
                  navigate('/app/carteiras');
                }}
              >
                <WalletIcon /> Visualizar carteiras
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Carteira</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
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
                    <TableCell>{transaction.description || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.walletName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
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
                    <TableCell className="text-muted-foreground">
                      {formatShortDate(transaction.date)}
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
    </main>
  );
};
