import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { paths } from "@/routing/config";

export const ProtectedRoute = ({ children }: { children: any }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to={paths.login} replace />;
  }
  return children;
};
