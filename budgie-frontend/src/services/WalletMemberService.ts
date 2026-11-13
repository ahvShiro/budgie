import api from '@/configs/axiosConfig.ts';
import type {
  ApiWalletMemberResponseDTO,
  WalletMemberRegisterDTO,
  WalletMemberUpdateDTO,
} from '@/services/types';

class WalletMemberService {
  private endpoint(walletId: number) {
    return `/api/v1/wallet/${walletId}/member`;
  }

  async getMembers(walletId: number) {
    const response = await api.get<ApiWalletMemberResponseDTO[]>(
      this.endpoint(walletId)
    );
    return response.data;
  }

  async addMember(walletId: number, data: WalletMemberRegisterDTO) {
    const response = await api.post<ApiWalletMemberResponseDTO>(
      this.endpoint(walletId),
      data
    );
    return response.data;
  }

  async updateMemberRole(
    walletId: number,
    userId: number,
    data: WalletMemberUpdateDTO
  ) {
    const response = await api.patch<ApiWalletMemberResponseDTO>(
      `${this.endpoint(walletId)}/${userId}`,
      data
    );
    return response.data;
  }

  async removeMember(walletId: number, userId: number) {
    await api.delete<void>(`${this.endpoint(walletId)}/${userId}`);
  }
}

export default new WalletMemberService();
