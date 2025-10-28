import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function RequireAuth({ children }) {
  const { user, booted } = useAuth();
  const loc = useLocation();
  if (!booted) return null; // splash/loading optional
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}
