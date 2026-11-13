import { AppSidebar } from '@/components/AppSidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import UserService from '@/services/UserService';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SESSION_EXPIRED_EVENT } from '@/configs/axiosConfig.ts';
import { toastApiError } from '@/lib/apiErrors.ts';
import type { AppLayoutContext } from '@/hooks/useCurrentUser.ts';
import type { ApiUserResponseDTO } from '@/services/types.ts';

export const AppLayout = () => {
  const [user, setUser] = useState<ApiUserResponseDTO | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleExpired = () => {
      navigate('/login', { replace: true });
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    };
  }, [navigate]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setUser(await UserService.getMe());
      } catch (err) {
        toastApiError(err);
      }
    };

    loadUser();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar userName={user?.name || 'Usuário'} />

      <SidebarInset>
        <header className="flex h-14 items-center px-6">
          <SidebarTrigger />
        </header>

        {/* Páginas leem pelo useCurrentUser, sem buscar o usuário de novo */}
        <Outlet context={{ user, setUser } satisfies AppLayoutContext} />
      </SidebarInset>
    </SidebarProvider>
  );
};
