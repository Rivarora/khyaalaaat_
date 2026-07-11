import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getUserRole } from "../utils/auth";


interface Props {
  children: ReactNode;
  allowedRoles?: Array<"user" | "admin">;
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const token = localStorage.getItem("token");
  const role = getUserRole();

  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
