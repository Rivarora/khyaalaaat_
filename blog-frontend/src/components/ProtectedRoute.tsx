import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getUserRole, isTokenValid } from "../utils/auth";


interface Props {
  children: ReactNode;
  allowedRoles?: Array<"user" | "admin">;
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const role = getUserRole();

  if (!isTokenValid()) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
