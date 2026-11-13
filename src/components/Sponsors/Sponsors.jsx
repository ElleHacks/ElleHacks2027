import { useEffect, useRef, useState } from 'react';
import { sponsorsInTier } from './sponsorsData';
import { useInView } from '../../hooks/useInView';
import Reveal from '../Reveal/Reveal';
import { Snow } from '../Ambient/Ambient';
import { tiltHandlers } from '../../hooks/tilt';

import bigBlock from "../../assets/Sponsors/BigBlock.png";
import bigBlock2 from "../../assets/Sponsors/Bigblock2.png";
import component33 from "../../assets/Sponsors/Component 33.png";
import ice2 from "../../assets/Sponsors/Ice2.png";
import ice3 from "../../assets/Sponsors/Ice3.png";
import ice4 from "../../assets/Sponsors/Ice4.png";
import ice5 from "../../assets/Sponsors/Ice5.png";
import ice8 from "../../assets/Sponsors/Ice8.png";
import ice9 from "../../assets/Sponsors/Ice9.png";
import ice10 from "../../assets/Sponsors/Ice10.png";
import fisherman from "../../assets/Sponsors/fisherman.png";

const bob = "animate-[ice-bob_6s_ease-in-out_infinite] motion-reduce:animate-none";
const FRAME1_ROWS_PER_PAGE = 2;
const FRAME2_ROWS_PER_PAGE = 5;

function Fisherman() {
  return (
    <img src={fisherman} alt="" className="absolute bottom-0 left-[3%] h-auto w-[30%] max-w-none md:w-[36.7%]" />
  );
}

/** Pack sponsors into rows of 2. */
function buildTwoColRows(sponsors) {
  const rows = [];
  for (let i = 0; i < sponsors.length; i += 2) {
    rows.push(sponsors.slice(i, i + 2));
  }
  return rows;
}

function chunkRows(rows, perPage) {
  const pages = [];
  for (let i = 0; i < rows.length; i += perPage) {
    pages.push(rows.slice(i, i + perPage));
  }
  return pages.length ? pages : [[]];
}

function pageStride(el) {
  const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 0;
  return (el.clientWidth || 1) + gap;
}

function Frame1MobilePager({ tier1, tier2, tier3, inView }) {
  // Top 2 cards stay pinned; only tier-3 rows below swipe (2 rows per page).
  const pinned = [...tier1, ...tier2];
  const pages = chunkRows(buildTwoColRows(tier3), FRAME1_ROWS_PER_PAGE);
  const scrollerRef = useRef(null);
  const [page, setPage] = useState(0);
  const showDots = pages.length > 1;

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    const onScroll = () => {
      setPage(Math.round(el.scrollLeft / pageStride(el)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [pages.length]);

  const goTo = (index) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * pageStride(el), behavior: 'smooth' });
    setPage(index);
  };

  return (
    <div className="relative z-[40] mt-8 flex w-full flex-col items-center gap-4 px-4 md:hidden">
      {/* Pinned top rows — never swipe away */}
      <div className="flex w-full flex-col items-center gap-4 [perspective:40cqw]">
        {pinned.map((sponsor, i) => (
          <SponsorCard
            key={sponsor.name || `pinned-${i}`}
            sponsor={sponsor}
            inView={inView}
            delay={i * 0.08}
            className="h-16 w-[min(82vw,24rem)] rounded-2xl"
          />
        ))}
      </div>

      {/* Swipeable bottom 2 rows — gap-x separates pages mid-swipe */}
      <div
        ref={scrollerRef}
        className="flex w-full snap-x snap-mandatory gap-x-6 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
        aria-label="More sponsor logos"
      >
        {pages.map((pageRows, pageIndex) => (
          <div
            key={pageIndex}
            className="flex w-full shrink-0 snap-center flex-col items-center justify-center gap-4"
            aria-hidden={pageIndex !== page}
          >
            {pageRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex w-full flex-row items-center justify-center gap-3 [perspective:40cqw]"
              >
                {row.map((sponsor, cardIndex) => (
                  <SponsorCard
                    key={sponsor.name || `${pageIndex}-${rowIndex}-${cardIndex}`}
                    sponsor={sponsor}
                    inView={inView}
                    delay={0.2 + pageIndex * 0.1 + rowIndex * 0.06 + cardIndex * 0.05}
                    className="h-16 w-[calc(50%-0.375rem)] rounded-xl"
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {showDots ? (
        <div
          className="mt-1 flex items-center justify-center gap-2 pb-8"
          role="tablist"
          aria-label="Sponsor pages"
        >
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === page}
              aria-label={`Page ${i + 1} of ${pages.length}`}
              onClick={() => goTo(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === page ? 'bg-[#FFEFD8]' : 'bg-[#FFEFD8]/40'
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="pb-8" aria-hidden="true" />
      )}
    </div>
  );
}

function Frame2MobilePager({ sponsors, inView }) {
  const pages = chunkRows(buildTwoColRows(sponsors), FRAME2_ROWS_PER_PAGE);
  const scrollerRef = useRef(null);
  const [page, setPage] = useState(0);
  const showDots = pages.length > 1;

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    const onScroll = () => {
      setPage(Math.round(el.scrollLeft / pageStride(el)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [pages.length]);

  const goTo = (index) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * pageStride(el), behavior: 'smooth' });
    setPage(index);
  };

  return (
    <div className="relative z-[40] mx-auto w-[92%] pt-8 md:hidden">
      <div
        ref={scrollerRef}
        className="flex w-full snap-x snap-mandatory gap-x-6 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
        aria-label="Sponsor logo pages"
      >
        {pages.map((pageRows, pageIndex) => (
          <div
            key={pageIndex}
            className="flex w-full shrink-0 snap-center flex-col items-center justify-center gap-2.5"
            aria-hidden={pageIndex !== page}
          >
            {pageRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex w-full flex-row items-center justify-center gap-3 [perspective:40cqw]"
              >
                {row.map((sponsor, cardIndex) => (
                  <SponsorCard
                    key={sponsor.name || `${pageIndex}-${rowIndex}-${cardIndex}`}
                    sponsor={sponsor}
                    inView={inView}
                    delay={pageIndex * 0.08 + rowIndex * 0.04 + cardIndex * 0.03}
                    className="h-10 w-[calc(50%-0.375rem)] rounded-full"
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {showDots ? (
        <div
          className="mt-5 flex items-center justify-center gap-2 pb-8"
          role="tablist"
          aria-label="Sponsor pages"
        >
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === page}
              aria-label={`Page ${i + 1} of ${pages.length}`}
              onClick={() => goTo(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === page ? 'bg-[#FFEFD8]' : 'bg-[#FFEFD8]/40'
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="pb-8" aria-hidden="true" />
      )}
    </div>
  );
}

function SponsorCard({ sponsor, inView, delay, className }) {
  const reveal = inView
    ? 'animate-[photo-pop_0.6s_ease-out_both] motion-reduce:animate-none'
    : 'opacity-0 motion-reduce:opacity-100';
  const base = `relative flex items-center justify-center overflow-hidden bg-white shadow-[0_0.28cqw_0.28cqw_rgba(0,0,0,0.25)] ${reveal} ${className}`;
  const hover = 'transition-transform duration-300 hover:-translate-y-[0.4cqw] hover:scale-[1.03] motion-reduce:hover:transform-none';
  const style = { animationDelay: `${delay}s` };

  // Placeholder slots render as blank cards, like the design.
  if (!sponsor.name) return <div aria-hidden="true" className={base} style={style} />;

  const content = sponsor.logo ? (
    <img src={sponsor.logo} alt="" className="h-[60%] w-[72%] object-contain" />
  ) : (
    <span className="px-2 text-center font-['Poppins'] text-xs font-semibold leading-[1.2] text-[#2C488C] md:px-[1cqw] md:text-[1.3cqw]">
      {sponsor.name}
    </span>
  );

  if (!sponsor.url) {
    return (
      <div {...tiltHandlers} className={`${base} ${hover}`} style={style}>
        {content}
      </div>
    );
  }

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${sponsor.name} (opens in a new tab)`}
      {...tiltHandlers}
      style={style}
      className={`${base} ${hover} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
    >
      {content}
    </a>
  );
}


function Sponsors() {
  const [topRef, topInView] = useInView();
  const [gridRef, gridInView] = useInView();

  const tier1 = sponsorsInTier(1);
  const tier2 = sponsorsInTier(2);
  const tier3 = sponsorsInTier(3);
  const tier4 = sponsorsInTier(4);

  return (
    <section
      aria-labelledby="sponsors-heading"
      className="@container relative w-full overflow-x-clip overflow-y-visible bg-[linear-gradient(180deg,#8f9bc9_0%,#b9add4_30%,#B1AAC3_50%,#829BB4_75%,#6DBDD8_100%)] md:bg-transparent"
    >
      {/* Gradients sit behind Component 33; the block art sits in front of it. */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
        <div className="aspect-[1440/1024] w-full bg-[linear-gradient(180deg,#8f9bc9_0%,#b9add4_60%,#B1AAC3_100%)]" />
        <div className="aspect-[1440/1024] w-full bg-[linear-gradient(180deg,#B1AAC3_0%,#829BB4_50%,#6DBDD8_100%)]" />
      </div>
      <img
        src={component33}
        alt=""
        className="pointer-events-none absolute top-[36.5%] left-[-10%] z-[1] hidden h-auto w-[117%] max-w-none select-none md:block"
      />
      {/* Section-level: above desktop gradient slabs; Frame 1 (z-30) keeps logos on top. */}
      <img
        src={ice2}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 z-[20] h-[16.8rem] w-[41%] max-w-none select-none md:h-1/2"
      />
      {/* Frame 1: "Last Years Sponsors" pyramid */}
      <div
        ref={topRef}
        className="@container relative z-[30] min-h-0 w-full overflow-clip bg-transparent md:aspect-[1440/1024] md:min-h-0"
      >
        <div className="pointer-events-none absolute inset-0 z-0 select-none" aria-hidden="true">
          <img src={bigBlock} alt="" className="absolute inset-0 h-full w-full max-w-none object-fill" />
          <img src={ice3} alt="" className="absolute right-0 top-[35%] h-full w-[40%] max-w-none md:hidden" />
          <img src={ice8} alt="" className={`absolute left-[44.5%] top-[79%] h-auto w-[13.5%] max-w-none ${bob}`} />
        </div>
        <Snow className="z-[2]" />

        <Reveal
          as="h2"
          id="sponsors-heading"
          className="relative z-10 m-0 px-4 pt-12 text-center font-['Poppins'] text-3xl font-bold leading-[1.3] text-[#FFEFD8] [text-shadow:0_0.28cqw_0.28cqw_rgba(0,0,0,0.25)] md:absolute md:left-1/2 md:top-[26%] md:-translate-x-1/2 md:whitespace-nowrap md:px-0 md:pt-0 md:text-[3.33cqw]"
        >
          Last Years Sponsors
        </Reveal>

        <Frame1MobilePager
          tier1={tier1}
          tier2={tier2}
          tier3={tier3}
          inView={topInView}
        />

        {/* Desktop pyramid — unchanged */}
        <div className="relative z-[40] mt-8 hidden flex-col items-center gap-6 md:absolute md:top-[39.2%] md:left-1/2 md:mt-0 md:flex md:gap-0 md:-translate-x-1/2">
          <div className="flex w-auto flex-row gap-[1.74cqw] [perspective:40cqw]">
            {tier1.map((sponsor, i) => (
              <SponsorCard key={i} sponsor={sponsor} inView={topInView} delay={0}
                className="h-[8.4cqw] w-[25.5cqw] rounded-[2cqw]" />
            ))}
          </div>
          <div className="mt-[3.4cqw] flex w-auto flex-row gap-[1.74cqw] [perspective:40cqw]">
            {tier2.map((sponsor, i) => (
              <SponsorCard key={i} sponsor={sponsor} inView={topInView} delay={0.15 + i * 0.08}
                className="h-[8.4cqw] w-[25.5cqw] rounded-[2cqw]" />
            ))}
          </div>
          <div className="mt-[3.3cqw] flex w-[76cqw] flex-wrap justify-center gap-x-[1.74cqw] gap-y-[1.25cqw] [perspective:40cqw]">
            {tier3.map((sponsor, i) => (
              <SponsorCard key={i} sponsor={sponsor} inView={topInView} delay={0.35 + i * 0.06}
                className="h-[6.75cqw] w-[17.6cqw] rounded-[1.8cqw]" />
            ))}
          </div>
        </div>

      </div>

      {/* Frame 2: 4 x 4 grid over the ice field, with the fisherman */}
      <div
        ref={gridRef}
        className="@container relative z-[30] min-h-0 w-full overflow-clip bg-transparent md:aspect-[1440/1024] md:min-h-0"
      >
        <div className="pointer-events-none absolute inset-0 z-0 select-none" aria-hidden="true">
          <img src={bigBlock2} alt="" className="absolute left-[0%] top-0 h-auto w-full max-w-none" />
          <img src={ice3} alt="" className="absolute left-[59%] top-0 h-auto w-[41%] max-w-none" />
          <img src={ice4} alt="" className="absolute left-0 top-[11%] h-auto w-[66.9%] max-w-none" />
          <img src={ice5} alt="" className="absolute left-[67%] top-[23.5%] h-auto w-[33%] max-w-none" />
          <img src={ice10} alt="" className="absolute left-[75%] top-[78.6%] h-auto w-[19%] max-w-none" />
          <img src={ice9} alt="" className="absolute bottom-0 left-0 h-auto w-[36%] max-w-none md:w-[36.7%]" />
          <Fisherman />
        </div>
        <Snow className="z-[1]" />

        <Frame2MobilePager sponsors={tier4} inView={gridInView} />

        {/* Desktop grid — unchanged */}
        <div className="relative z-[40] mx-auto hidden w-[92%] grid-cols-2 justify-items-center gap-3 pt-0 [perspective:40cqw] md:absolute md:top-[2.1%] md:left-1/2 md:mx-0 md:flex md:w-[66.2cqw] md:-translate-x-1/2 md:flex-wrap md:justify-center md:gap-x-[2.8cqw] md:gap-y-[1.1cqw] md:pt-0">
          {tier4.map((sponsor, i) => (
            <SponsorCard key={i} sponsor={sponsor} inView={gridInView} delay={(i % 4) * 0.06 + Math.floor(i / 4) * 0.1}
              className="h-[5.4cqw] w-[14.4cqw] rounded-full" />
          ))}
        </div>

      </div>
    </section>
  );
}

export default Sponsors;
