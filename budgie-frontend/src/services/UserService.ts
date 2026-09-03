import api from "@/configs/axiosConfig";
import type { ApiUserResponseDTO } from "@/services/types";

class UserService {
  private endpoint: string = "/api/v1/users";

  async getMe() {
    const response = await api.get<ApiUserResponseDTO>(`${this.endpoint}/me`);
    return response.data;
  }
}

export default new UserService();
