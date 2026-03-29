import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RequireAuthProps {
  children: ReactNode;
  role?: "admin" | "officer";
}

export default function RequireAuth({ children, role }: RequireAuthProps) {
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) return <Navigate to="/login" replace />;

  // Role hierarchy: admin can access everything, officer can access officer-only features
  if (role === "admin" && user.role !== "admin") {
    // Only admin can access admin routes
    return <Navigate to="/" replace />;
  }

  if (role === "officer" && user.role !== "admin" && user.role !== "officer") {
    // Officer routes require at least officer role (admin can also access)
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
