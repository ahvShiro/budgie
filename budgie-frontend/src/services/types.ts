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

export interface WalletRegisterDTO {
  name: string;
  description: string;
}

export interface WalletUpdateDTO {
  name: string;
  description: string;
  active: boolean;
}

export type WalletRole = 'OWNER' | 'EDITOR' | 'VIEWER';

export interface WalletMemberRegisterDTO {
  email: string;
  role: WalletRole;
}

export interface WalletMemberUpdateDTO {
  role: WalletRole;
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

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface ApiTransactionResponseDTO {
  id: number;
  walletId: number;
  categoryId: number | null;
  createdById: number;
  type: TransactionType;
  value: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface TransactionRegisterDTO {
  categoryId: number | null;
  type: TransactionType;
  value: number;
  description: string;
  date: string;
}

export interface TransactionUpdateDTO {
  categoryId: number | null;
  type: TransactionType;
  value: number;
  description: string;
  date: string;
}

export interface CategoryRegisterDTO {
  name: string;
  transactionType: TransactionType;
  color: string; // hex sem o '#'
  icon?: string;
}

export interface CategoryUpdateDTO {
  name: string;
  transactionType: TransactionType;
  color: string | null; // hex sem o '#'
  icon: string | null;
  active: boolean;
}

export interface ApiCategoryResponseDTO {
  id: number;
  walletId: number;
  name: string;
  transactionType: TransactionType;
  color: string | null; // hex sem o '#'
  icon: string | null;
  active: boolean;
}

export interface ApiPageDTO<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface TransactionQueryParams {
  type?: TransactionType;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sort?: string;
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

export interface ApiWalletListingDTO {
  id: number;
  ownerId: number;
  name: string;
  description: string | null;
  members: string[];
  balance: number;
}

export interface ApiWalletResponseDTO {
  id: number;
  ownerId: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface ApiWalletMemberResponseDTO {
  id: number;
  walletId: number;
  userId: number;
  userName: string;
  userEmail: string;
  role: WalletRole;
  createdAt: string;
}
