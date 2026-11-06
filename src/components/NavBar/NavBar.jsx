import { useEffect, useRef, useState } from "react";
import logo from "../../assets/AboutUs/new-logo.png";

const links = [
  { label: "Sponsors", href: "#sponsors" },
  { label: "FAQ", href: "#faq" },
  { label: "Location", href: "#location" },
  { label: "Team", href: "#meettheteam" },
  { label: "Contact Us", href: "#contactus" },
];

// Every anchor in App.jsx, top to bottom, and the nav link each one lights up.
const sectionLinks = [
  ["hero", null],
  ["aboutus", null],
  ["sponsors", "#sponsors"],
  ["iis", "#sponsors"],
  ["faq", "#faq"],
  ["location", "#location"],
  ["meettheteam", "#meettheteam"],
  ["contactus", "#contactus"],
];

// Tracks the scroll position: how far down the page is (0-1, written straight to the
// depth bar), whether we've left the top, and which section is on screen.
function useScrollSpy(progressRef) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      }
      setScrolled(window.scrollY > 40);

      let current = null;
      for (const [id, href] of sectionLinks) {
        const anchor = document.getElementById(id);
        if (anchor && anchor.getBoundingClientRect().top <= window.innerHeight * 0.35) current = href;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [progressRef]);

  return [scrolled, active];
}

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef(null);
  const [scrolled, active] = useScrollSpy(progressRef);

  return (
    <>
      {/* Depth gauge: fills across the top as you scroll down the page. */}
      <div className="pointer-events-none fixed top-0 left-0 z-[101] h-[3px] w-full" aria-hidden="true">
        <div
          ref={progressRef}
          className="h-full w-full origin-left scale-x-0 bg-[linear-gradient(90deg,#c4ecfd,#9fdcf5_50%,#ffefd8)] shadow-[0_0_8px_rgba(196,236,253,0.8)]"
        />
      </div>

      <header className="@container pointer-events-none fixed top-0 left-0 z-[100] box-border flex w-full flex-col pl-[5.56%] pr-8 pt-5 font-poppins sm:pr-10 sm:pt-6">
        <div className="flex w-full items-center justify-end sm:justify-between">
          <a
            href="#hero"
            aria-label="ElleHacks, back to top"
            className="pointer-events-auto hidden shrink-0 rounded-full sm:block"
          >
            <img
              src={logo}
              alt=""
              className="h-10 w-10 object-contain transition-transform duration-300 hover:scale-110 hover:animate-[wiggle_0.5s_ease-in-out] motion-reduce:hover:animate-none"
            />
          </a>

          <div className="pointer-events-auto hidden items-center gap-3 sm:flex">
            <nav
              className={`flex items-center rounded-full bg-[#131c34] px-6 py-2.5 transition-shadow duration-300 ${
                scrolled ? "shadow-[0_6px_20px_rgba(5,10,30,0.45)]" : ""
              }`}
              aria-label="Page"
            >
              <ul className="m-0 flex list-none items-center gap-6 p-0">
                {links.map((link) => {
                  const isActive = active === link.href;
                  return (
                    <li key={link.href}>
                      <a
                        className={`group relative block text-sm leading-none font-medium whitespace-nowrap no-underline transition-colors hover:text-[#c4ecfd] ${
                          isActive ? "text-[#c4ecfd]" : "text-[#CFC6E9]"
                        }`}
                        href={link.href}
                        aria-current={isActive ? "location" : undefined}
                      >
                        {link.label}
                        <span
                          aria-hidden="true"
                          className={`absolute -bottom-1.5 left-0 h-[2px] w-full origin-left rounded-full bg-[#c4ecfd] transition-transform duration-300 group-hover:scale-x-100 ${
                            isActive ? "scale-x-100" : "scale-x-0"
                          }`}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <a
              href="#"
              className="rounded-full bg-[#c4ecfd] px-5 py-2.5 text-sm leading-none font-semibold whitespace-nowrap text-[#1c2744] no-underline transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_6px_16px_rgba(196,236,253,0.45)] motion-reduce:hover:translate-y-0"
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
            {/* The three lines fold into an X while the menu is open. */}
            <span className={`block h-[0.57cqw] w-[5.7cqw] rounded-full bg-[#f4f1ea] transition-transform duration-300 ${menuOpen ? "translate-y-[2cqw] rotate-45" : ""}`} />
            <span className={`block h-[0.57cqw] w-[5.7cqw] rounded-full bg-[#f4f1ea] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-[0.57cqw] w-[5.7cqw] rounded-full bg-[#f4f1ea] transition-transform duration-300 ${menuOpen ? "-translate-y-[2cqw] -rotate-45" : ""}`} />
          </button>
        </div>

        {menuOpen && (
          <nav
            id="mobile-page-nav"
            className="pointer-events-auto mt-[4.4cqw] -mr-4 ml-auto w-[53%] origin-top-right animate-[menu-drop_0.3s_ease-out] rounded-[6.9cqw] bg-[#131c34]/90 px-[6.9cqw] py-[7cqw] backdrop-blur-sm motion-reduce:animate-none sm:hidden"
            aria-label="Page"
          >
            <ul className="m-0 flex list-none flex-col gap-[4.6cqw] p-0">
              {links.map((link, i) => (
                <li
                  key={link.href}
                  style={{ animationDelay: `${0.05 + i * 0.05}s` }}
                  className="animate-[rise-in_0.4s_ease-out_both] motion-reduce:animate-none"
                >
                  <a
                    className={`block text-[5cqw] leading-none font-medium no-underline hover:text-[#c4ecfd] ${
                      active === link.href ? "text-[#c4ecfd]" : "text-[#CFC6E9]"
                    }`}
                    href={link.href}
                    aria-current={active === link.href ? "location" : undefined}
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
    </>
  );
}

export default NavBar;
