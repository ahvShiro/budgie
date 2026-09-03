import { Stat } from "@/components/Stat";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatMonthLabel, formatShortDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import DashboardService, { MOCK_WALLET_ID } from "@/services/DashboardService";
import type { ApiErrorMessage, ApiTransactionResponseDTO, ApiWalletSummaryDTO } from "@/services/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  income: { label: "Receitas", color: "var(--income)" },
  expense: { label: "Despesas", color: "var(--expense)" },
} satisfies ChartConfig;

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
  const [summary, setSummary] = useState<ApiWalletSummaryDTO | null>(null);
  const [transactions, setTransactions] = useState<ApiTransactionResponseDTO[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [walletSummary, recentTransactions] = await Promise.all([
          DashboardService.getSummary(MOCK_WALLET_ID),
          DashboardService.getRecentTransactions(MOCK_WALLET_ID),
        ]);

        setSummary(walletSummary);
        setTransactions(recentTransactions);
      } catch (err) {
        if (axios.isAxiosError<ApiErrorMessage>(err) && err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Erro inesperado");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // A transação só traz categoryId, o nome vem do byCategory do resumo
  const categoryNames = new Map(
    summary?.byCategory.map((category) => [category.categoryId, category.categoryName])
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-6">
      {isLoading || !summary ? (
        <DashboardSkeleton />
      ) : (
        <>
          <h1 className="flex flex-col gap-1">
            <span className="text-sm font-normal text-muted-foreground">Saldo atual</span>
            <span className="text-4xl font-extrabold sm:text-6xl">
              {formatCurrency(summary.balance)}
            </span>
          </h1>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Receitas" value={summary.totalIncome} tone="income" />
            <Stat label="Despesas" value={summary.totalExpense} tone="expense" />
            <Stat label="Lançamentos" value={summary.transactionCount} format="count" />
          </div>

          <section className="flex flex-col gap-4 pt-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-extrabold">Receitas x despesas</h2>
              <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
            </div>

            <ChartContainer config={chartConfig} className="max-h-72 w-full">
              <BarChart data={summary.byMonth}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatMonthLabel}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
              </BarChart>
            </ChartContainer>
          </section>

          <Separator />

          <section className="flex flex-col gap-4 pt-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-extrabold">Lançamentos recentes</h2>
              <p className="text-sm text-muted-foreground">Últimas movimentações da sua carteira</p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {(transaction.categoryId && categoryNames.get(transaction.categoryId)) || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatShortDate(transaction.date)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        transaction.type === "INCOME" ? "text-income" : "text-expense"
                      )}
                    >
                      {transaction.type === "INCOME" ? "+ " : "- "}
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
