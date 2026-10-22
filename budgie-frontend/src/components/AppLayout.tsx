import { AppSidebar } from '@/components/AppSidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import UserService from '@/services/UserService';
import type { ApiErrorMessage } from '@/services/types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SESSION_EXPIRED_EVENT } from '@/configs/axiosConfig.ts';

export const AppLayout = () => {
  const [userName, setUserName] = useState('');
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
        const user = await UserService.getMe();
        setUserName(user.name);
      } catch (err) {
        if (axios.isAxiosError<ApiErrorMessage>(err) && err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error('Erro inesperado');
        }
      }
    };

    loadUser();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar userName={userName || 'Usuário'} />

      <SidebarInset>
        <header className="flex h-14 items-center px-6">
          <SidebarTrigger />
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};
