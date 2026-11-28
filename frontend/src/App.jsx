import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ApplicationForm from "./pages/Dashboard/ApplicationForm/ApplicationForm";
import Home from "./pages/Dashboard/Home/Home";
import Contact from "./pages/Dashboard/Contact/Contact";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminApplication from "./pages/Admin/AdminApplication";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import ComingSoon from "./pages/Dashboard/ComingSoon";
import MyApplication from "./pages/Dashboard/MyApplication/MyApplication";
import { useEffect, useState } from "react";
import API from "./utils/api";

// Sends signed-in users to the right place for their role
function HomeRedirect() {
  const { user, loading } = useAuth();
  const [target, setTarget] = useState(null); // where to send a hacker once we know their status

  // Hackers only - check whether they've submitted yet
  useEffect(() => {
    if (loading || !user || user.role === "admin") return undefined;

    let active = true;
    API.get("/applications/me")
      .then((res) => {
        if (active) {
          setTarget(res.data.application?.status === "incomplete" ? "/application" : "/dashboard/home");
        }
      })
      .catch(() => active && setTarget("/dashboard/home"));
    return () => {
      active = false;
    };
  }, [loading, user]);

  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/signin" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (!target) return <p>Loading…</p>;
  return <Navigate to={target} replace />;
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
        <Route path="verify-email" element={<VerifyEmail />} />

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

      {/* Hacker dashboard is for signed-in hackers*/}
      <Route element={<ProtectedRoute  hacker/>}>
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="sponsors" element={<ComingSoon title="Sponsors" />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<ComingSoon title="FAQ" />} />
          <Route path="application" element={<MyApplication />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
