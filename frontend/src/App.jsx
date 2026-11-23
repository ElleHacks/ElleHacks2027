import { Navigate, Outlet, Route, Routes } from "react-router-dom";
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
import Schedule from "./pages/Dashboard/Schedule/Schedule";
import Announcements from "./pages/Dashboard/Announcements/Announcements";
import EventInfo from "./pages/Dashboard/EventInfo/EventInfo";

// Local-only: set VITE_DASHBOARD_PREVIEW=true in frontend/.env.local to view the dashboard without signing in
const previewDashboard = import.meta.env.DEV && import.meta.env.VITE_DASHBOARD_PREVIEW === "true";

// Sends signed-in users to the right place for their role
function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/signin" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard/home"} replace />;
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

      {/* Hacker dashboard is for accepted hackers only and draws its own sidebar instead of the site nav bar */}
      <Route element={previewDashboard ? <Outlet /> : <ProtectedRoute acceptedApplicant />}>
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="event-info" element={<EventInfo />} />
          <Route path="sponsors" element={<ComingSoon title="Sponsors" />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<ComingSoon title="FAQ" />} />
          <Route path="application" element={<ComingSoon title="My Application" />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
