import type {
  ApiCategorySummaryDTO,
  ApiMonthSummaryDTO,
  ApiTransactionResponseDTO,
  ApiWalletSummaryDTO,
} from "@/services/types";

const MOCK_WALLET_ID = 1;

const MOCK_CATEGORIES: ApiCategorySummaryDTO[] = [
  { categoryId: 1, categoryName: "Salário", total: 4200 },
  { categoryId: 2, categoryName: "Freelance", total: 950 },
  { categoryId: 3, categoryName: "Moradia", total: 1350 },
  { categoryId: 4, categoryName: "Alimentação", total: 486.32 },
  { categoryId: 5, categoryName: "Transporte", total: 32.9 },
  { categoryId: 6, categoryName: "Saúde", total: 99.9 },
  { categoryId: 7, categoryName: "Lazer", total: 68 },
];

const MOCK_TRANSACTIONS: ApiTransactionResponseDTO[] = [
  { id: 1, walletId: MOCK_WALLET_ID, categoryId: 1, type: "INCOME", value: 4200, description: "Salário", date: "2026-08-01", createdAt: "2026-08-01T09:12:00" },
  { id: 2, walletId: MOCK_WALLET_ID, categoryId: 4, type: "EXPENSE", value: 486.32, description: "Supermercado", date: "2026-08-02", createdAt: "2026-08-02T18:40:00" },
  { id: 3, walletId: MOCK_WALLET_ID, categoryId: 5, type: "EXPENSE", value: 32.9, description: "Uber", date: "2026-08-02", createdAt: "2026-08-02T21:05:00" },
  { id: 4, walletId: MOCK_WALLET_ID, categoryId: 2, type: "INCOME", value: 950, description: "Freelance - landing page", date: "2026-08-03", createdAt: "2026-08-03T14:22:00" },
  { id: 5, walletId: MOCK_WALLET_ID, categoryId: 3, type: "EXPENSE", value: 1350, description: "Aluguel", date: "2026-08-04", createdAt: "2026-08-04T08:00:00" },
  { id: 6, walletId: MOCK_WALLET_ID, categoryId: 6, type: "EXPENSE", value: 99.9, description: "Academia", date: "2026-08-04", createdAt: "2026-08-04T08:15:00" },
  { id: 7, walletId: MOCK_WALLET_ID, categoryId: 7, type: "EXPENSE", value: 68, description: "Cinema", date: "2026-08-04", createdAt: "2026-08-04T20:30:00" },
];

const MOCK_CLOSED_MONTHS: ApiMonthSummaryDTO[] = [
  { month: "2026-03", income: 4200, expense: 3100 },
  { month: "2026-04", income: 4200, expense: 2850 },
  { month: "2026-05", income: 4800, expense: 3600 },
  { month: "2026-06", income: 4200, expense: 2950 },
  { month: "2026-07", income: 5100, expense: 3400 },
];

function transactionsOf(walletId: number) {
  return MOCK_TRANSACTIONS.filter((transaction) => transaction.walletId === walletId);
}

function sumByType(transactions: ApiTransactionResponseDTO[], type: ApiTransactionResponseDTO["type"]) {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.value, 0);
}

function delay<T>(value: T, ms = 900): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// TODO trocar os mocks pelas chamadas reais qdo Wallet/Transaction existirem no backend
class DashboardService {
  // private endpoint: string = "/api/v1/wallets";

  // GET /api/v1/wallets/{walletId}/summary
  async getSummary(walletId: number): Promise<ApiWalletSummaryDTO> {
    const transactions = transactionsOf(walletId);
    const totalIncome = sumByType(transactions, "INCOME");
    const totalExpense = sumByType(transactions, "EXPENSE");

    return delay({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length,
      byCategory: MOCK_CATEGORIES,
      byMonth: [...MOCK_CLOSED_MONTHS, { month: "2026-08", income: totalIncome, expense: totalExpense }],
    });
  }

  // GET /api/v1/wallets/{walletId}/transactions?size=N&sort=date,desc
  async getRecentTransactions(walletId: number): Promise<ApiTransactionResponseDTO[]> {
    return delay(transactionsOf(walletId).sort((a, b) => b.date.localeCompare(a.date)));
  }
}

export { MOCK_WALLET_ID };
export default new DashboardService();
