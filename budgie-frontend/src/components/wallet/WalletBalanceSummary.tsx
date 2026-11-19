import { formatCurrency } from '@/lib/formatters.ts';
import { cn } from '@/lib/utils.ts';
import type { ApiWalletListingDTO } from '@/services/types.ts';

interface WalletBalanceSummaryProps {
  wallet: ApiWalletListingDTO;
  monthName: string;
}

export const WalletBalanceSummary = ({
  wallet,
  monthName,
}: WalletBalanceSummaryProps) => {
  const monthTotal = wallet.monthIncome + wallet.monthExpense;
  const incomeShare =
    monthTotal > 0 ? (wallet.monthIncome / monthTotal) * 100 : 0;

  return (
    <>
      <p
        className={cn(
          'text-3xl font-extrabold tabular-nums',
          wallet.balance < 0 && 'text-expense'
        )}
      >
        {formatCurrency(wallet.balance)}
      </p>

      <dl className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm tabular-nums">
        <dt className="text-muted-foreground capitalize">{monthName}</dt>
        <dd className="text-income">+ {formatCurrency(wallet.monthIncome)}</dd>
        <dd className="text-expense">
          - {formatCurrency(wallet.monthExpense)}
        </dd>
      </dl>

      {/* Proporção entradas x saídas do mês, os valores já estão no texto acima */}
      <div aria-hidden className="flex h-1 w-full overflow-hidden bg-muted">
        {monthTotal > 0 && (
          <>
            <div className="bg-income" style={{ width: `${incomeShare}%` }} />
            <div className="flex-1 bg-expense" />
          </>
        )}
      </div>
    </>
  );
};
