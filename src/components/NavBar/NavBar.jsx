import { useState } from "react";

const links = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#aboutus" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Interested In Sponsoring", href: "#iis" },
  { label: "FAQ", href: "#faq" },
  { label: "Location", href: "#location" },
  { label: "Team", href: "#meettheteam" },
  { label: "Contact Us", href: "#contactus" },
];

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="pointer-events-none fixed top-0 left-0 z-[100] box-border flex w-full justify-center px-5 pt-[1.15rem]">
      <nav
        className="@container pointer-events-auto hidden w-[min(68rem,100%)] items-center gap-[2.5cqw] rounded-full bg-[#131c34] pt-[0.5cqw] pr-[3cqw] pb-[0.4cqw] pl-[2.5cqw] sm:flex"
        aria-label="Page"
      >
        <span className="h-[5cqw] w-[5cqw] shrink-0 rounded-full bg-[#f4f1ea]" aria-hidden="true" />
        <ul className="m-0 flex flex-1 list-none items-center justify-between gap-[1.4cqw] p-0">
          {links.map((link) => (
            <li key={link.href}>
              <a
                className="block text-[1.85cqw] leading-none whitespace-nowrap text-[#cfc6e9] no-underline hover:text-[#c4ecfd]"
                href={link.href}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="@container pointer-events-auto flex w-full flex-col items-end sm:hidden">
        <button
          type="button"
          className="flex h-[13.7cqw] w-[13.7cqw] flex-col items-center justify-center gap-[1.43cqw] rounded-full bg-[#131c34]"
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
            className="mt-[3.4cqw] w-full rounded-[6.9cqw] bg-[#131c34] px-[6.9cqw] py-[6.9cqw]"
            aria-label="Page"
          >
            <span className="mb-[5.7cqw] block h-[16cqw] w-[16cqw] rounded-full bg-[#f4f1ea]" aria-hidden="true" />
            <ul className="m-0 flex list-none flex-col gap-[4.6cqw] p-0">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    className="block text-[5.1cqw] leading-none text-[#cfc6e9] no-underline hover:text-[#c4ecfd]"
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

export default NavBar;
