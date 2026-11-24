import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// Exported from Figma with the Akira Expanded wordmark outlined, so no font is needed
import logo from "../../assets/Dashboard/logo.svg";
import iconHome from "../../assets/Dashboard/icon-home.svg";
import iconSchedule from "../../assets/Dashboard/icon-schedule.svg";
import iconAnnouncements from "../../assets/Dashboard/icon-announcements.svg";
import iconEventInfo from "../../assets/Dashboard/icon-event-info.svg";
import iconSponsors from "../../assets/Dashboard/icon-sponsors.svg";
import iconContact from "../../assets/Dashboard/icon-contact.svg";
import iconFaq from "../../assets/Dashboard/icon-faq.svg";
import iconApplication from "../../assets/Dashboard/icon-application.svg";
import "./Dashboard.css";

// Icons are drawn as CSS masks so they take the link's text colour (light normally, dark when active)
const links = [
  { label: "Home", to: "/dashboard/home", icon: iconHome, width: 36, height: 31.3333 },
  { label: "Schedule", to: "/dashboard/schedule", icon: iconSchedule, width: 36, height: 36 },
  { label: "Announcements", to: "/dashboard/announcements", icon: iconAnnouncements, width: 40, height: 34 },
  { label: "Event Info", to: "/dashboard/event-info", icon: iconEventInfo, width: 36, height: 36 },
  { label: "Sponsors", to: "/dashboard/sponsors", icon: iconSponsors, width: 44, height: 36 },
  { label: "Contact", to: "/dashboard/contact", icon: iconContact, width: 44, height: 36 },
  { label: "FAQ", to: "/dashboard/faq", icon: iconFaq, width: 44, height: 33 },
  // The design sets this label in SemiBold white rather than Medium cream like the others
  { label: "My Application", to: "/dashboard/application", icon: iconApplication, width: 36, height: 34, emphasis: true },
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
          <img className="dashboard-logo" src={logo} alt="ElleHacks" width="209" height="66" />

          <nav className="dashboard-nav" aria-label="Dashboard">
            {links.map(({ label, to, icon, width, height, emphasis }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  ["dashboard-nav__link", emphasis && "dashboard-nav__link--emphasis", isActive && "is-active"]
                    .filter(Boolean)
                    .join(" ")
                }
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
