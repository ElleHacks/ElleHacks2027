import { useEffect, useRef } from "react";

// A dive meter down the right edge: scrolling the page "dives" from the ice to the seabed.
// It writes straight to the DOM on scroll, so scrolling never re-renders React.
const MAX_DEPTH = 400; // metres at the bottom of the page
const TICKS = [0, 100, 200, 300, 400];

function DepthGauge() {
  const markerRef = useRef(null);
  const fillRef = useRef(null);
  const readoutRef = useRef(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      markerRef.current.style.top = `${progress * 100}%`;
      fillRef.current.style.transform = `scaleY(${progress})`;
      readoutRef.current.textContent = `${Math.round(progress * MAX_DEPTH)} m`;
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
  }, []);

  return (
    <div
      className="pointer-events-none fixed top-1/2 right-3 z-[90] hidden h-[42vh] -translate-y-1/2 font-poppins lg:block"
      aria-hidden="true"
    >
      <div className="relative h-full w-[3px] rounded-full bg-[#131c34]/40">
        <div
          ref={fillRef}
          className="absolute inset-0 origin-top scale-y-0 rounded-full bg-[linear-gradient(180deg,#c4ecfd,#3967AB)]"
        />
        {TICKS.map((tick) => (
          <span
            key={tick}
            className="absolute right-[6px] h-px w-1.5 bg-[#c4ecfd]/70"
            style={{ top: `${(tick / MAX_DEPTH) * 100}%` }}
          />
        ))}
        <div ref={markerRef} className="absolute right-0 flex -translate-y-1/2 items-center">
          <span
            ref={readoutRef}
            className="mr-2 rounded-full bg-[#131c34]/85 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-[#c4ecfd] shadow-[0_2px_8px_rgba(5,10,30,0.4)]"
          >
            0 m
          </span>
          <span className="-mr-[5px] h-[13px] w-[13px] rounded-full border-2 border-[#131c34] bg-[#c4ecfd] shadow-[0_0_8px_rgba(196,236,253,0.9)]" />
        </div>
      </div>
    </div>
  );
}

export default DepthGauge;
