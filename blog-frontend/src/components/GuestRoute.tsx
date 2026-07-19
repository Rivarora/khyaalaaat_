import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

// Opposite of ProtectedRoute:
// If user IS logged in → redirect away from login/register
// If user is NOT logged in → show the page normally

interface Props {
  children: ReactNode;
}

const GuestRoute = ({ children }: Props) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-purple-400 animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Already logged in — send to the right place
    return <Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;