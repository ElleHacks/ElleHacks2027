import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ApplicationForm from "./pages/Dashboard/ApplicationForm/ApplicationForm";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminApplication from "./pages/Admin/AdminApplication";

// Sends signed-in users to the right place for their role
function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/signin" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/application"} replace />;
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomeRedirect />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/applications/:id" element={<AdminApplication />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      <Route element={<Layout bare />}>
        <Route element={<ProtectedRoute />}>
          <Route path="application" element={<ApplicationForm />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
