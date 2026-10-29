import { useState } from "react";

const links = [
  { label: "Sponsors", href: "#sponsors" },
  { label: "FAQ", href: "#faq" },
  { label: "Location", href: "#location" },
  { label: "Team", href: "#meettheteam" },
  { label: "Contact Us", href: "#contactus" },
];

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="@container pointer-events-none fixed top-0 left-0 z-[100] box-border flex w-full flex-col pl-[5.56%] pr-8 pt-5 font-poppins sm:pr-10 sm:pt-6">
      <div className="flex w-full items-center justify-end sm:justify-between">
        <span
          className="pointer-events-auto hidden h-10 w-10 shrink-0 rounded-full bg-[#273659] sm:block"
          aria-hidden="true"
        />

        <div className="pointer-events-auto hidden items-center gap-3 sm:flex">
          <nav className="flex items-center rounded-full bg-[#131c34] px-6 py-2.5" aria-label="Page">
            <ul className="m-0 flex list-none items-center gap-6 p-0">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    className="block text-sm leading-none font-medium whitespace-nowrap text-[#CFC6E9] no-underline hover:text-[#c4ecfd]"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href="#"
            className="rounded-full bg-[#c4ecfd] px-5 py-2.5 text-sm leading-none font-semibold whitespace-nowrap text-[#1c2744] no-underline transition hover:bg-white"
          >
            Apply Now
          </a>
        </div>

        <button
          type="button"
          className="pointer-events-auto -mr-4 flex h-[13.7cqw] w-[13.7cqw] flex-col items-center justify-center gap-[1.43cqw] rounded-full bg-[#12182c] sm:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-page-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="block h-[0.57cqw] w-[5.7cqw] rounded-full bg-[#f4f1ea]" />
          <span className="block h-[0.57cqw] w-[5.7cqw] rounded-full bg-[#f4f1ea]" />
          <span className="block h-[0.57cqw] w-[5.7cqw] rounded-full bg-[#f4f1ea]" />
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-page-nav"
          className="pointer-events-auto mt-[4.4cqw] -mr-4 ml-auto w-[53%] rounded-[6.9cqw] bg-[#131c34]/90 px-[6.9cqw] py-[7cqw] sm:hidden"
          aria-label="Page"
        >
          <ul className="m-0 flex list-none flex-col gap-[4.6cqw] p-0">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  className="block text-[5cqw] leading-none font-medium text-[#CFC6E9] no-underline hover:text-[#c4ecfd]"
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="mt-[5.7cqw] inline-block rounded-full bg-[#c4ecfd] px-[5.1cqw] py-[2.3cqw] text-[5.1cqw] leading-none font-semibold text-[#1c2744] no-underline"
            onClick={() => setMenuOpen(false)}
          >
            Apply Now
          </a>
        </nav>
      )}
    </header>
  );
}

export default NavBar;
