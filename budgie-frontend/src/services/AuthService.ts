import api from "@/configs/axiosConfig";
import type { ApiAuthResponseDTO, ApiUserResponseDTO, AuthDTO, RegisterDTO } from "@/services/types";

class AuthService {
  private endpoint: string = "/api/v1/auth";

  async register(data: RegisterDTO) {
    const response = await api.post<ApiUserResponseDTO>(`${this.endpoint}/register`, data);
    return response.data;
  }

  async authenticate(data: AuthDTO) {
    const response = await api.post<ApiAuthResponseDTO>(`${this.endpoint}/login`, data);
    return response.data;
  }

  async recoverPassword() {
  }
  async resetPassword() {}
}

export default new AuthService();