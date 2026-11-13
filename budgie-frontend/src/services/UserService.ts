import api from '@/configs/axiosConfig';
import type { ApiUserResponseDTO, UserUpdateDTO } from '@/services/types';

class UserService {
  private endpoint: string = '/api/v1/users';

  async getMe() {
    const response = await api.get<ApiUserResponseDTO>(`${this.endpoint}/me`);
    return response.data;
  }

  async updateMe(data: UserUpdateDTO) {
    const response = await api.put<ApiUserResponseDTO>(
      `${this.endpoint}/me`,
      data,
    );
    return response.data;
  }
}

export default new UserService();
