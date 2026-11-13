import type { WalletRole } from '@/services/types.ts';

export const ROLE_LABELS: Record<WalletRole, string> = {
  OWNER: 'Dono',
  EDITOR: 'Editor',
  VIEWER: 'Leitor',
};

// Papéis que dá pra atribuir a um membro, dono vem só da criação da carteira
export const ASSIGNABLE_ROLES: WalletRole[] = ['EDITOR', 'VIEWER'];
