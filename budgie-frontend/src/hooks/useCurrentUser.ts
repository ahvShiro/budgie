import type { ApiUserResponseDTO } from '@/services/types.ts';
import { useOutletContext } from 'react-router-dom';

export interface AppLayoutContext {
  user: ApiUserResponseDTO | null;
}

// Usuário que o AppLayout já buscou, null enquanto carrega
export const useCurrentUser = () => useOutletContext<AppLayoutContext>().user;
