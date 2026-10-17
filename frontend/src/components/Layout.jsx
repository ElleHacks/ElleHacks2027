import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/signin");
  };

  return (
    <>
      <header className="site-header">
        <Link to="/" className="site-title">ElleHacks 2027</Link>
        {user && (
          <nav className="site-nav">
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            <Link to="/application">Application</Link>
            <span className="muted">{user.email}</span>
            <button type="button" onClick={handleSignOut}>Sign out</button>
          </nav>
        )}
      </header>
      <main className="page">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
