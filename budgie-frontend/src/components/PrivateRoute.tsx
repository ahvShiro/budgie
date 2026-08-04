import { Navigate, Outlet } from "react-router-dom";
import { session } from "@/services/session";

export const PrivateRoute = () => {
  return session.isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};
