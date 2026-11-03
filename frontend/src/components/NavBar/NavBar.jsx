import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Section links point back to the landing page
const links = [
  { label: "Home", href: "/#hero" },
  { label: "About", href: "/#aboutus" },
  { label: "Sponsors", href: "/#sponsors" },
  { label: "Interested In Sponsoring", href: "/#iis" },
  { label: "FAQ", href: "/#faq" },
  { label: "Location", href: "/#location" },
  { label: "Team", href: "/#meettheteam" },
  { label: "Contact Us", href: "/#contactus" },
];

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const pageLinks = user?.role === "admin" ? [...links, { label: "Admin", to: "/admin" }] : links;

  const handleSignOut = () => {
    setMenuOpen(false);
    logout();
    navigate("/signin");
  };

  const renderLink = (link, className, onClick) =>
    link.to ? (
      <Link className={className} to={link.to} onClick={onClick}>
        {link.label}
      </Link>
    ) : (
      <a className={className} href={link.href} onClick={onClick}>
        {link.label}
      </a>
    );

  // Login pill on the right; becomes Sign out once signed in
  const authButton = (className) =>
    user ? (
      <button type="button" className={`cursor-pointer border-0 ${className}`} onClick={handleSignOut}>
        Sign out
      </button>
    ) : (
      <Link className={`no-underline ${className}`} to="/signin" onClick={() => setMenuOpen(false)}>
        Login
      </Link>
    );

  return (
    <header className="pointer-events-none fixed top-0 left-0 z-[100] box-border flex w-full justify-center px-5 pt-[1.15rem]">
      <nav
        className="@container pointer-events-auto hidden w-[min(68rem,100%)] items-center gap-[2.5cqw] rounded-full bg-[#131c34] pt-[0.5cqw] pr-[1.2cqw] pb-[0.4cqw] pl-[2.5cqw] sm:flex"
        aria-label="Page"
      >
        <span className="h-[5cqw] w-[5cqw] shrink-0 rounded-full bg-[#f4f1ea]" aria-hidden="true" />
        <ul className="m-0 flex flex-1 list-none items-center justify-between gap-[1.4cqw] p-0">
          {pageLinks.map((link) => (
            <li key={link.label}>
              {renderLink(
                link,
                "block text-[1.85cqw] leading-none whitespace-nowrap text-[#cfc6e9] no-underline hover:text-[#c4ecfd]",
              )}
            </li>
          ))}
        </ul>
        {authButton(
          "ml-[1.5cqw] flex h-[4.6cqw] w-[13.8cqw] shrink-0 items-center justify-center rounded-full bg-[#c4ecfd] p-0 font-[inherit] text-[2.15cqw] font-semibold leading-none text-black hover:bg-[#cfc6e9]",
        )}
      </nav>

      <div className="@container pointer-events-auto flex w-full flex-col items-end sm:hidden">
        <button
          type="button"
          className="flex h-[13.7cqw] w-[13.7cqw] cursor-pointer flex-col items-center justify-center gap-[1.43cqw] rounded-full border-0 bg-[#131c34] p-0"
          aria-expanded={menuOpen}
          aria-controls="mobile-page-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="block h-[0.57cqw] w-[5.7cqw] rounded-full bg-[#f4f1ea]" />
          <span className="block h-[0.57cqw] w-[5.7cqw] rounded-full bg-[#f4f1ea]" />
          <span className="block h-[0.57cqw] w-[5.7cqw] rounded-full bg-[#f4f1ea]" />
        </button>

        {menuOpen && (
          <nav
            id="mobile-page-nav"
            className="mt-[3.4cqw] box-border w-full rounded-[6.9cqw] bg-[#131c34] px-[6.9cqw] py-[6.9cqw]"
            aria-label="Page"
          >
            <span className="mb-[5.7cqw] block h-[16cqw] w-[16cqw] rounded-full bg-[#f4f1ea]" aria-hidden="true" />
            <ul className="m-0 flex list-none flex-col gap-[4.6cqw] p-0">
              {pageLinks.map((link) => (
                <li key={link.label}>
                  {renderLink(
                    link,
                    "block text-[5.1cqw] leading-none text-[#cfc6e9] no-underline hover:text-[#c4ecfd]",
                    () => setMenuOpen(false),
                  )}
                </li>
              ))}
            </ul>
            {authButton(
              "mt-[6.9cqw] inline-flex rounded-full bg-[#c4ecfd] px-[6cqw] py-[2.3cqw] font-[inherit] text-[5.1cqw] font-semibold leading-none text-black",
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default NavBar;
