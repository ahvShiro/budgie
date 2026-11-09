import api from '@/configs/axiosConfig.ts';
import type {
  ApiWalletListingDTO,
  ApiWalletResponseDTO,
  WalletRegisterDTO,
  WalletUpdateDTO,
} from '@/services/types';

class WalletService {
  private endpoint: string = '/api/v1/wallet';

  async createWallet(data: WalletRegisterDTO) {
    const response = await api.post<ApiWalletResponseDTO>(this.endpoint, data);
    return response.data;
  }

  async getWallets() {
    const response = await api.get<ApiWalletListingDTO[]>(this.endpoint);
    return response.data;
  }

  async updateWallet(id: number, data: WalletUpdateDTO) {
    const response = await api.put<ApiWalletResponseDTO>(
      `${this.endpoint}/${id}`,
      data
    );
    return response.data;
  }

  async deleteWallet(id: number) {
    await api.delete<void>(`${this.endpoint}/${id}`);
  }
}

export default new WalletService();
