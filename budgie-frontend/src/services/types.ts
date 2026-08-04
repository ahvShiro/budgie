export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthDTO {
  email: string; 
  password: string;
}

export interface EmailDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface ApiMessageDTO {
  message: string;
}

export interface ApiAuthResponseDTO {
  token: string;
}

export interface ApiUserResponseDTO {
  id: number; 
  name: string;
  email: string;
  createdAt: string;
}

export interface ApiErrorMessage {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}

export type TransactionType = "INCOME" | "EXPENSE";

export interface ApiTransactionResponseDTO {
  id: number;
  walletId: number;
  categoryId: number | null;
  type: TransactionType;
  value: number;
  description: string;
  date: string; 
  createdAt: string;
}

export interface ApiCategorySummaryDTO {
  categoryId: number;
  categoryName: string;
  total: number;
}

export interface ApiMonthSummaryDTO {
  month: string; // "2026-08"
  income: number;
  expense: number;
}

export interface ApiWalletSummaryDTO {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  byCategory: ApiCategorySummaryDTO[];
  byMonth: ApiMonthSummaryDTO[];
}

