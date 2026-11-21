import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoHead from "../../assets/dashboard/logo-head.svg";
import logoFace from "../../assets/dashboard/logo-face.svg";
import iconHome from "../../assets/dashboard/icon-home.svg";
import iconSponsors from "../../assets/dashboard/icon-sponsors.svg";
import iconContact from "../../assets/dashboard/icon-contact.svg";
import iconFaq from "../../assets/dashboard/icon-faq.svg";
import iconApplication from "../../assets/dashboard/icon-application.svg";
import "./Dashboard.css";

// Icons are drawn as CSS masks so they take the link's text colour (light normally, dark when active)
const links = [
  { label: "Home", to: "/dashboard", end: true, icon: iconHome, width: 36, height: 31.3333 },
  { label: "Sponsors", to: "/dashboard/sponsors", icon: iconSponsors, width: 44, height: 36 },
  { label: "Contact", to: "/dashboard/contact", icon: iconContact, width: 44, height: 36 },
  { label: "FAQ", to: "/dashboard/faq", icon: iconFaq, width: 44, height: 33 },
  { label: "My Application", to: "/dashboard/application", icon: iconApplication, width: 36, height: 34 },
];

function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar__top">
          <div className="dashboard-logo" role="img" aria-label="ElleHacks">
            <img className="dashboard-logo__head" src={logoHead} alt="" width="74.5749" height="65.3249" />
            <img className="dashboard-logo__face" src={logoFace} alt="" width="67.6565" height="58.4073" />
            <span className="dashboard-logo__word dashboard-logo__word--top" aria-hidden="true">Elle</span>
            <span className="dashboard-logo__word dashboard-logo__word--bottom" aria-hidden="true">Hacks</span>
          </div>

          <nav className="dashboard-nav" aria-label="Dashboard">
            {links.map(({ label, to, end, icon, width, height }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => (isActive ? "dashboard-nav__link is-active" : "dashboard-nav__link")}
              >
                <span className="dashboard-nav__icon-slot" aria-hidden="true">
                  <span
                    className="dashboard-nav__icon"
                    style={{ width, height, maskImage: `url("${icon}")`, WebkitMaskImage: `url("${icon}")` }}
                  />
                </span>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button type="button" className="dashboard-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
