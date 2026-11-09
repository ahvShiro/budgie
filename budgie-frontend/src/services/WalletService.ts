import api from '@/configs/axiosConfig.ts';
import type { ApiWalletListingDTO } from '@/services/types';

class WalletService {
  private endpoint: string = '/api/v1/wallet';

  async getWallets() {
    const response = await api.get<ApiWalletListingDTO[]>(this.endpoint);
    return response.data;
  }
}

export default new WalletService();
