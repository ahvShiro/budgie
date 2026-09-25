import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import UserService from "@/services/UserService";
import type { ApiErrorMessage } from "@/services/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "sonner";

// Casca da área autenticada. Busca o usuário uma vez só, em vez de cada página /app/* refazer isso
export const AppLayout = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await UserService.getMe();
        setUserName(user.name);
      } catch (err) {
        if (axios.isAxiosError<ApiErrorMessage>(err) && err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Erro inesperado");
        }
      }
    };

    loadUser();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar userName={userName || "Usuário"} />

      <SidebarInset>
        <header className="flex h-14 items-center px-6">
          <SidebarTrigger />
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};
