import api from "@/configs/axiosConfig";
import type { ApiUserResponseDTO, RegisterDTO } from "@/services/types";

class AuthService {
  private endpoint: string = "/api/v1/auth";

  async register(data: RegisterDTO) {
    const response = await api.post<ApiUserResponseDTO>(`${this.endpoint}/register`, data);
    return response.data;
  }
}

export default new AuthService();