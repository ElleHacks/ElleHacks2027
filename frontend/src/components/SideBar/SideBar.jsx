import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/new-logo.png";
import iconHome from "../../assets/SideBar/Home.png";
import iconSponsors from "../../assets/SideBar/coin-hand.png";
import iconContact from "../../assets/SideBar/email.png";
import iconFaq from "../../assets/SideBar/message-chat-01.png";
import iconApplication from "../../assets/SideBar/file-check-02.png";
import "./SideBar.css";

const links = [
  { label: "Home", to: "/dashboard/home", icon: iconHome },
  { label: "Sponsors", to: "/dashboard/sponsors", icon: iconSponsors },
  { label: "Contact", to: "/dashboard/contact", icon: iconContact },
  { label: "FAQ", to: "/dashboard/faq", icon: iconFaq },
  { label: "My Application", to: "/application", icon: iconApplication },
];

function SideBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/signin", { replace: true });
  };

  const renderLinks = (mobile = false) =>
    links.map(({ label, to, icon }) => (
      <NavLink
        key={label}
        to={to}
        className={({ isActive }) =>
          `${mobile ? "mobileNavLink" : "sidebarNavLink"}${isActive ? " active" : ""}`
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <img src={icon} alt="" className="sidebarIcon" />
        <span>{label}</span>
      </NavLink>
    ));

  return (
    <>
      <aside className="sidebar">
        <div className="sidebarBrand">
          <img src={logo} alt="ElleHacks logo" className="sidebarLogo" />
          <span className="sidebarBrandName">ElleHacks</span>
        </div>
        <nav className="sidebarNav" aria-label="Dashboard">
          {renderLinks()}
        </nav>
        <button className="sidebarLogout" type="button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <button
        className="sidebarMenuButton"
        type="button"
        aria-label={isMobileMenuOpen ? "Close dashboard menu" : "Open dashboard menu"}
        aria-expanded={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      {isMobileMenuOpen && (
        <div className="sidebarMobileMenu">
          <nav className="sidebarMobileNav" aria-label="Dashboard">
            {renderLinks(true)}
          </nav>
          <button className="sidebarMobileLogout" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default SideBar;
