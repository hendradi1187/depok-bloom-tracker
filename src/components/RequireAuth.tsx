import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RequireAuthProps {
  children: ReactNode;
  role?: "admin" | "officer";
}

export default function RequireAuth({ children, role }: RequireAuthProps) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (role === "admin" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
