import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { session } from "@/services/session";
import {
  ArrowLeftRight,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Tag,
  User,
  Wallet,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
  { title: "Transações", url: "/app/transacoes", icon: ArrowLeftRight },
  { title: "Categorias", url: "/app/categorias", icon: Tag },
  { title: "Carteiras", url: "/app/carteiras", icon: Wallet },
];

type AppSidebarProps = {
  userName: string;
};

export const AppSidebar = ({ userName }: AppSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const initial = userName.trim().charAt(0).toUpperCase() || "?";

  const handleLogout = () => {
    session.clearToken();
    navigate("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="text-xl font-extrabold">Budgie</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Conta</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/app/perfil/senha"}>
                  <Link to="/app/perfil/senha">
                    <User />
                    <span>Perfil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/suporte"}>
                  <Link to="/suporte">
                    <LifeBuoy />
                    <span>Suporte</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="size-6">
                    <AvatarFallback>{initial}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{userName}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="min-w-56">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
