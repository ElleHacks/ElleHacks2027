import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API, { getErrorMessage } from "../utils/api";

function ProtectedRoute({ role, acceptedApplicant = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [applicationStatus, setApplicationStatus] = useState("loading");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!acceptedApplicant || loading || !user || user.role === "admin") return undefined;

    let active = true;
    API.get("/applications/me")
      .then((res) => {
        if (active) setApplicationStatus(res.data.application?.status || "incomplete");
      })
      .catch((error) => {
        if (active) setApplicationStatus(`error:${getErrorMessage(error)}`);
      });

    return () => {
      active = false;
    };
  }, [acceptedApplicant, loading, retryCount, user]);

  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  if (acceptedApplicant && user.role === "admin") return <Navigate to="/admin" replace />;
  if (acceptedApplicant && applicationStatus === "loading") {
    return <p className="dashboardAccessMessage" role="status">Checking your application status…</p>;
  }
  if (acceptedApplicant && applicationStatus !== "accepted") {
    if (applicationStatus === "incomplete" || applicationStatus === "submitted" ||
      applicationStatus === "waitlisted" || applicationStatus === "rejected") {
      return <Navigate to="/application" replace />;
    }

    return (
      <div className="dashboardAccessMessage" role="alert">
        <p>
          {applicationStatus.startsWith("error:")
            ? `We couldn’t verify your application status: ${applicationStatus.slice(6)}`
            : "We couldn’t verify your application status. Please try again."}
        </p>
        <button
          type="button"
          onClick={() => {
            setApplicationStatus("loading");
            setRetryCount((count) => count + 1);
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
