import api from "@/configs/axiosConfig";
import type { ApiAuthResponseDTO, ApiMessageDTO, ApiUserResponseDTO, AuthDTO, EmailDTO, RegisterDTO, ResetPasswordDTO } from "@/services/types";

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

  async recoverPassword(data: EmailDTO) {
    const response = await api.post<ApiMessageDTO>(`${this.endpoint}/forgot-password`, data);
    return response.data;
  }

  async resetPassword(data: ResetPasswordDTO) {
    const response = await api.post<ApiMessageDTO>(`${this.endpoint}/reset-password`, data);
    return response.data;
  }
}

export default new AuthService();