import { Navigate, Outlet } from "react-router-dom";
import { session } from "@/services/session";

export const PublicRoute = () => {
  return session.isAuthenticated() ? <Navigate to="/app/dashboard" replace /> : <Outlet />;
};
