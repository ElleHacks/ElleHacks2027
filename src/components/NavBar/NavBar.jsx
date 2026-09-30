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
  return (
    <header className="pointer-events-none fixed top-0 left-0 z-[100] box-border flex w-full justify-center px-5 pt-[1.15rem]">
      <nav
        className="@container pointer-events-auto flex w-[min(68rem,100%)] items-center gap-[2.5cqw] rounded-full bg-[#131c34] pt-[0.5cqw] pr-[3cqw] pb-[0.4cqw] pl-[2.5cqw]"
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
    </header>
  );
}

export default NavBar;
