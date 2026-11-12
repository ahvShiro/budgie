import api from '@/configs/axiosConfig.ts';
import type {
  ApiCategoryResponseDTO,
  CategoryRegisterDTO,
  TransactionType,
} from '@/services/types';

class CategoryService {
  private endpoint(walletId: number) {
    return `/api/v1/wallet/${walletId}/category`;
  }

  async getCategories(walletId: number, type?: TransactionType) {
    const response = await api.get<ApiCategoryResponseDTO[]>(
      this.endpoint(walletId),
      { params: { type } }
    );
    return response.data;
  }

  async createCategory(walletId: number, data: CategoryRegisterDTO) {
    const response = await api.post<ApiCategoryResponseDTO>(
      this.endpoint(walletId),
      data
    );
    return response.data;
  }
}

export default new CategoryService();
