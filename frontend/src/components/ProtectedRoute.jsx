import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// role="admin": admins only. get sent to /admin instead.
// hacker: any signed-in hacker.
function ProtectedRoute({ role, hacker = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  if (hacker && user.role === "admin") return <Navigate to="/admin" replace />;

  return <Outlet />;
}

export default ProtectedRoute;
