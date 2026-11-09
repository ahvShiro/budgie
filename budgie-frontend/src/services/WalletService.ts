import api from '@/configs/axiosConfig.ts';
import type {
  ApiWalletListingDTO,
  ApiWalletResponseDTO,
  WalletRegisterDTO,
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
}

export default new WalletService();
