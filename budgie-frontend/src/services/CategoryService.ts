import api from '@/configs/axiosConfig.ts';
import type {
  ApiCategoryResponseDTO,
  CategoryRegisterDTO,
  CategoryUpdateDTO,
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

  async updateCategory(walletId: number, id: number, data: CategoryUpdateDTO) {
    const response = await api.put<ApiCategoryResponseDTO>(
      `${this.endpoint(walletId)}/${id}`,
      data
    );
    return response.data;
  }

  async deleteCategory(walletId: number, id: number) {
    await api.delete<void>(`${this.endpoint(walletId)}/${id}`);
  }
}

export default new CategoryService();
