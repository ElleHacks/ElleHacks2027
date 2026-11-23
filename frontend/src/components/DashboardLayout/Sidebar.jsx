import { NavLink } from "react-router-dom";
import Logo from "./Logo";

const links = [
  { label: "Home", to: "/dashboard", end: true },
  { label: "Sponsors", to: "/dashboard/sponsors" },
  { label: "Contact", to: "/dashboard/contact" },
  { label: "FAQ", to: "/dashboard/faq" },
  { label: "My Application", to: "/dashboard/my-application" },
];

function Sidebar() {
  return (
    <aside className="dash-sidebar">
      <Logo />

      <nav aria-label="Dashboard">
        <ul className="dash-links">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) => `dash-link${isActive ? " is-active" : ""}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;