import { SESSION_EXPIRED_EVENT } from '@/configs/axiosConfig.ts';
import { toast } from 'sonner';
import axios from 'axios';
import type { ApiErrorMessage } from '@/services/types.ts';

export const toastApiError = (err: unknown) => {
  if (axios.isAxiosError<ApiErrorMessage>(err) && err.response) {
    const id = err.response.status === 401 ? SESSION_EXPIRED_EVENT : undefined;
    toast.error(err.response.data.message, { id });
  } else {
    toast.error('Erro inesperado. Contate o suporte!');
  }
};
