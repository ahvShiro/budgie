import api from '@/configs/axiosConfig.ts';
import type {
  ApiPageDTO,
  ApiTransactionResponseDTO,
  TransactionQueryParams,
  TransactionRegisterDTO,
  TransactionUpdateDTO,
} from '@/services/types';

class TransactionService {
  private endpoint(walletId: number) {
    return `/api/v1/wallet/${walletId}/transaction`;
  }

  async createTransaction(walletId: number, data: TransactionRegisterDTO) {
    const response = await api.post<ApiTransactionResponseDTO>(
      this.endpoint(walletId),
      data
    );
    return response.data;
  }

  async getTransactions(walletId: number, params?: TransactionQueryParams) {
    const response = await api.get<ApiPageDTO<ApiTransactionResponseDTO>>(
      this.endpoint(walletId),
      { params }
    );
    return response.data;
  }

  async updateTransaction(
    walletId: number,
    id: number,
    data: TransactionUpdateDTO
  ) {
    const response = await api.put<ApiTransactionResponseDTO>(
      `${this.endpoint(walletId)}/${id}`,
      data
    );
    return response.data;
  }
}

export default new TransactionService();
