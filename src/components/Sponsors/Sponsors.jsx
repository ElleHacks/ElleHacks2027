import { Fragment, useRef, useState } from 'react';
import { sponsorsInTier } from './sponsorsData';
import { useInView } from '../../hooks/useInView';

import bigBlock from "../../assets/Sponsors/BigBlock.png";
import bigBlock2 from "../../assets/Sponsors/Bigblock2.png";
import ice2 from "../../assets/Sponsors/Ice2.png";
import ice3 from "../../assets/Sponsors/Ice3.png";
import ice4 from "../../assets/Sponsors/Ice4.png";
import ice5 from "../../assets/Sponsors/Ice5.png";
import ice7 from "../../assets/Sponsors/Ice7.png";
import ice8 from "../../assets/Sponsors/Ice8.png";
import ice10 from "../../assets/Sponsors/Ice10.png";
import fisherman from "../../assets/Sponsors/fisherman.png";


const bob = 'animate-[ice-bob_6s_ease-in-out_infinite] motion-reduce:animate-none';

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;


// Hovering (or keyboard-focusing) a card bobs it like a buoy and sends ripples + bubbles up
// from where the pointer entered.
const SPLASH_COOLDOWN_MS = 700;

function useSplash() {
  const [splashes, setSplashes] = useState([]);
  const nextBatch = useRef(0);
  const lastSplash = useRef(new WeakMap());

  const splash = (frame, frameEl, event) => {
    if (!frameEl || prefersReducedMotion()) return;
    const card = event.currentTarget;

    // Focus from a mouse click would splash twice; only keyboard focus should trigger it.
    if (event.type === 'focus' && !card.matches(':focus-visible')) return;

    // Skip if this card splashed moments ago, so quick in-and-out hovers don't stack up.
    const last = lastSplash.current.get(card);
    if (last !== undefined && event.timeStamp - last < SPLASH_COOLDOWN_MS) return;
    lastSplash.current.set(card, event.timeStamp);

    card.animate(
      [
        { transform: 'translateY(0) rotate(0)' },
        { transform: 'translateY(0.5cqw) rotate(-2deg) scale(0.95)' },
        { transform: 'translateY(-0.3cqw) rotate(1.5deg) scale(1.03)' },
        { transform: 'translateY(0.1cqw) rotate(-0.5deg)' },
        { transform: 'translateY(0) rotate(0)' },
      ],
      { duration: 650, easing: 'ease-out' }
    );

    
    const area = frameEl.getBoundingClientRect();
    const rect = card.getBoundingClientRect();
    const fromPointer = event.clientX || event.clientY;
    const px = fromPointer ? event.clientX : rect.left + rect.width / 2;
    const py = fromPointer ? event.clientY : rect.top + rect.height / 2;
    const x = `${((px - area.left) / area.width) * 100}%`;
    const y = `${((py - area.top) / area.height) * 100}%`;

    const batch = nextBatch.current++;
    const fresh = Array.from({ length: 12 }, (_, i) => ({
      key: `${batch}-${i}`,
      batch,
      frame,
      ripple: i === 0,
      x,
      y,
      offset: (Math.random() - 0.5) * 6,
      dx: (Math.random() - 0.5) * 6,
      size: 0.5 + Math.random() * 1.2,
      delay: Math.random() * 0.35,
    }));
    setSplashes((current) => [...current, ...fresh]);
    setTimeout(
      () => setSplashes((current) => current.filter((s) => s.batch !== batch)),
      2200
    );
  };

  return [splashes, splash];
}


function SplashLayer({ splashes }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      {splashes.map((s) => (
        <Fragment key={s.key}>
          {s.ripple && (
            <>
              <span
                className="absolute h-[12cqw] w-[12cqw] animate-[ripple_0.9s_ease-out_forwards] rounded-full border-2 border-white/70"
                style={{ left: s.x, top: s.y }}
              />
              <span
                className="absolute h-[12cqw] w-[12cqw] animate-[ripple_1.1s_ease-out_0.18s_both] rounded-full border border-[#9fdcf5]/80"
                style={{ left: s.x, top: s.y }}
              />
            </>
          )}
          <span
            className="absolute animate-[bubble-float_1.6s_ease-in-out_forwards] rounded-full border border-white/60 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.9),rgba(255,255,255,0.15)_40%,rgba(255,255,255,0.05))] opacity-0"
            style={{
              left: s.x,
              top: s.y,
              marginLeft: `${s.offset}cqw`,
              width: `${s.size}cqw`,
              height: `${s.size}cqw`,
              '--dx': `${s.dx}cqw`,
              animationDelay: `${s.delay}s`,
            }}
          />
        </Fragment>
      ))}
    </div>
  );
}


function SponsorCard({ sponsor, inView, delay, className, onSplash }) {
  const reveal = inView
    ? 'animate-[photo-pop_0.6s_ease-out_both] motion-reduce:animate-none'
    : 'opacity-0 motion-reduce:opacity-100';
  const base = `relative flex items-center justify-center overflow-hidden bg-white shadow-[0_0.28cqw_0.28cqw_rgba(0,0,0,0.25)] ${reveal} ${className}`;
  const style = { animationDelay: `${delay}s` };

  // Placeholder slots render as blank cards, like the design.
  if (!sponsor.name) return <div aria-hidden="true" className={base} style={style} />;

  const content = sponsor.logo ? (
    <img src={sponsor.logo} alt="" className="h-[60%] w-[72%] object-contain" />
  ) : (
    <span className="px-[1cqw] text-center font-['Poppins'] text-[1.3cqw] font-semibold leading-[1.2] text-[#2C488C]">
      {sponsor.name}
    </span>
  );

  if (!sponsor.url) return <div className={base} style={style}>{content}</div>;

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${sponsor.name} (opens in a new tab)`}
      onMouseEnter={onSplash}
      onFocus={onSplash}
      style={style}
      className={`group ${base} transition-[translate,scale,box-shadow] duration-300 hover:-translate-y-[0.4cqw] hover:scale-105 hover:shadow-[0_0.8cqw_1.4cqw_rgba(0,0,0,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hover:transform-none`}
    >
      {content}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(57,103,171,0.18)_50%,transparent_70%)] transition-transform duration-700 group-hover:translate-x-full motion-reduce:hidden"
      />
    </a>
  );
}


function Sponsors() {
  const [topRef, topInView] = useInView();
  const [gridRef, gridInView] = useInView();
  const [splashes, splash] = useSplash();

  const splashTop = (event) => splash('top', topRef.current, event);
  const splashGrid = (event) => splash('grid', gridRef.current, event);

  const tier1 = sponsorsInTier(1);
  const tier2 = sponsorsInTier(2);
  const tier3 = sponsorsInTier(3);
  const tier4 = sponsorsInTier(4);

  return (
    <section aria-labelledby="sponsors-heading" className="relative w-full overflow-clip">

      {/* Frame 1: "Last Years Sponsors" pyramid */}
      <div
        ref={topRef}
        className="@container relative w-full aspect-[1440/1024] overflow-clip bg-[linear-gradient(180deg,#8f9bc9_0%,#b9add4_60%,#d9bdd8_100%)]"
      >
        <div className="pointer-events-none absolute inset-0 z-0 select-none" aria-hidden="true">
          <img src={bigBlock} alt="" className="absolute inset-0 h-full w-full max-w-none object-fill" />
          <img src={ice2} alt="" className="absolute right-0 top-0 h-full w-auto max-w-none" />
          <img src={ice8} alt="" className={`absolute left-[44.5%] top-[79%] h-auto w-[13.5%] max-w-none ${bob}`} />
        </div>

        <h2
          id="sponsors-heading"
          className="absolute left-1/2 top-[26%] z-10 m-0 -translate-x-1/2 whitespace-nowrap text-center font-['Poppins'] text-[3.33cqw] font-bold leading-[1.3] text-[#FFEFD8] [text-shadow:0_0.28cqw_0.28cqw_rgba(0,0,0,0.25)]"
        >
          Last Years Sponsors
        </h2>

        <div className="absolute left-1/2 top-[39.2%] z-10 flex -translate-x-1/2 flex-col items-center">
          <div className="flex gap-[1.74cqw]">
            {tier1.map((sponsor, i) => (
              <SponsorCard key={i} sponsor={sponsor} onSplash={splashTop} inView={topInView} delay={0}
                className="h-[8.4cqw] w-[25.5cqw] rounded-[2cqw]" />
            ))}
          </div>
          <div className="mt-[3.4cqw] flex gap-[1.74cqw]">
            {tier2.map((sponsor, i) => (
              <SponsorCard key={i} sponsor={sponsor} onSplash={splashTop} inView={topInView} delay={0.15 + i * 0.08}
                className="h-[8.4cqw] w-[25.5cqw] rounded-[2cqw]" />
            ))}
          </div>
          <div className="mt-[3.3cqw] flex w-[76cqw] flex-wrap justify-center gap-x-[1.74cqw] gap-y-[1.25cqw]">
            {tier3.map((sponsor, i) => (
              <SponsorCard key={i} sponsor={sponsor} onSplash={splashTop} inView={topInView} delay={0.35 + i * 0.06}
                className="h-[6.75cqw] w-[17.6cqw] rounded-[1.8cqw]" />
            ))}
          </div>
        </div>

        <SplashLayer splashes={splashes.filter((s) => s.frame === 'top')} />
      </div>

      {/* Frame 2: 4 x 4 grid over the ice field, with the fisherman */}
      <div
        ref={gridRef}
        className="@container relative w-full aspect-[1440/1024] overflow-clip bg-[linear-gradient(180deg,#c4b5d8_0%,#7aa3d3_30%,#5f9fd3_60%,#74bde0_100%)]"
      >
        <div className="pointer-events-none absolute inset-0 z-0 select-none" aria-hidden="true">
          <img src={bigBlock2} alt="" className="absolute left-0 top-0 h-auto w-full max-w-none" />
          <img src={ice3} alt="" className="absolute left-[59%] top-0 h-auto w-[41%] max-w-none" />
          <img src={ice4} alt="" className="absolute left-0 top-[8.8%] h-auto w-[66.9%] max-w-none" />
          <img src={ice5} alt="" className={`absolute left-[82%] top-[23.5%] h-auto w-[33%] max-w-none ${bob} [animation-delay:-2s]`} />
          <img src={ice7} alt="" className={`absolute left-[9.6%] top-[60.3%] h-auto w-[16.1%] max-w-none ${bob} [animation-delay:-4s]`} />
          <img src={ice10} alt="" className={`absolute left-[75%] top-[78.6%] h-auto w-[19%] max-w-none ${bob} [animation-delay:-1s]`} />
          <img src={fisherman} alt="" className="absolute bottom-0 left-[3%] h-auto w-[36.7%] max-w-none" />
        </div>

        <div className="absolute left-1/2 top-[2.1%] z-10 flex w-[66.2cqw] -translate-x-1/2 flex-wrap justify-center gap-x-[2.8cqw] gap-y-[1.1cqw]">
          {tier4.map((sponsor, i) => (
            <SponsorCard key={i} sponsor={sponsor} onSplash={splashGrid} inView={gridInView} delay={(i % 4) * 0.06 + Math.floor(i / 4) * 0.1}
              className="h-[5.4cqw] w-[14.4cqw] rounded-full" />
          ))}
        </div>

        <SplashLayer splashes={splashes.filter((s) => s.frame === 'grid')} />
      </div>
    </section>
  );
}

export default Sponsors;
