import { Navigate } from "react-router";
import { type ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const userRole = localStorage.getItem("role");

  // If no role is set, redirect to landing page
  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  // If user's role is not in the allowed roles, redirect to landing page
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
