import type { ApiUserResponseDTO } from '@/services/types.ts';
import { useOutletContext } from 'react-router-dom';

export interface AppLayoutContext {
  user: ApiUserResponseDTO | null;
  setUser: (user: ApiUserResponseDTO) => void;
}

// Usuário que o AppLayout já buscou, null enquanto carrega
export const useCurrentUser = () => useOutletContext<AppLayoutContext>().user;

export const useSetCurrentUser = () =>
  useOutletContext<AppLayoutContext>().setUser;
