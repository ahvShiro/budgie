import api from '@/configs/axiosConfig.ts';
import type {
  ApiPageDTO,
  ApiTransactionResponseDTO,
  TransactionQueryParams,
} from '@/services/types';

class TransactionService {
  private endpoint(walletId: number) {
    return `/api/v1/wallet/${walletId}/transaction`;
  }

  async getTransactions(walletId: number, params?: TransactionQueryParams) {
    const response = await api.get<ApiPageDTO<ApiTransactionResponseDTO>>(
      this.endpoint(walletId),
      { params }
    );
    return response.data;
  }
}

export default new TransactionService();
