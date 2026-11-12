import heroBack from "../../assets/Hero/Hero-Back.png";
import block from "../../assets/Hero/Block.png";
import cat from "../../assets/Hero/Cat.png";
import house from "../../assets/Hero/House.png";
import tree2 from "../../assets/Hero/tree 2.png";
import tree1 from "../../assets/Hero/tree1.png";
import { Snow } from "../Ambient/Ambient";

const TITLE = "ElleHacks 2027";

// Entrance for the headline block; each line comes in a little after the last.
const enter = "animate-[rise-in_0.9s_cubic-bezier(0.2,0.7,0.3,1)_both] motion-reduce:animate-none";

// The glowing lights painted into the night sky of Hero-Back.png, as [left %, top %, size %].
// Found by scanning the image's opaque pixels for spots much brighter than their surroundings.
const SKY_LIGHTS = [
  [73.3, 29, 1.53], [81, 9.4, 1.32], [74.9, 20.1, 1.32], [46.1, 32.3, 1.11], [84.8, 24.4, 0.9],
  [59.9, 35.4, 0.83], [92.5, 20.5, 0.83], [49.5, 30.3, 0.76], [73.5, 25.2, 0.76], [84.3, 27.1, 0.69],
  [95.7, 2.2, 0.76], [53.5, 27.7, 0.83], [70.9, 29.4, 0.83], [78, 29.3, 0.69], [66.2, 31.6, 0.69],
  [58.9, 36.4, 0.9], [91.7, 17.4, 0.63], [64.5, 33.5, 0.76], [69.3, 29.8, 0.69], [52.1, 37, 0.63],
  [96.5, 10.9, 0.63], [82, 27.4, 0.56], [92.6, 13.3, 0.56], [93.3, 22.9, 0.49], [58.3, 37, 0.42],
  [93.9, 24.1, 0.42], [98.2, 8.7, 0.49], [95.7, 20.8, 0.49], [64.7, 32.6, 0.49], [70.6, 30.6, 0.49],
  [79.5, 12.2, 0.63], [96.7, 8.5, 0.35], [92.2, 21.6, 0.56], [91.2, 24.2, 0.42], [76.1, 29.6, 0.35],
  [53, 29.4, 0.35], [95.1, 10.3, 0.28], [52.5, 31, 0.35], [86, 22, 0.28], [82.6, 24.9, 0.35],
  [99.4, 6.4, 0.35], [84.6, 22.8, 0.21], [51.6, 30.8, 0.28], [52.6, 27.4, 0.21], [85.4, 21.5, 0.28],
];

// A soft halo over each painted light, each twinkling at its own pace.
function SkyLights() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] mix-blend-screen motion-reduce:hidden">
      {SKY_LIGHTS.map(([left, top, size], i) => (
        <span
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 animate-[twinkle_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(255,236,190,0.95),rgba(255,200,120,0.45)_35%,transparent_70%)]"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${Math.max(size * 2.6, 1.2)}cqw`,
            height: `${Math.max(size * 2.6, 1.2)}cqw`,
            animationDuration: `${2.2 + (i % 5) * 0.6}s`,
            animationDelay: `${-((i * 0.77) % 4)}s`,
          }}
        />
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section
      className="@container relative min-h-[min(100svh,48rem)] w-full overflow-hidden bg-[linear-gradient(180deg,#202c49_17.79%,#433589_100%)] md:aspect-[2880/2048] md:min-h-0"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={heroBack}
          alt=""
          className="absolute inset-0 h-full w-full max-w-none object-fill select-none"
        />
        <SkyLights />
        <Snow fall={74} className="z-[1]" />
        <img
          src={house}
          alt=""
          className="absolute bottom-[15%] left-[80%] z-[2] h-auto w-[20.0694%] max-w-none select-none"
        />
        <img
          src={block}
          alt=""
          className="absolute bottom-0 left-0 z-[3] h-auto w-full max-w-none select-none"
        />
        <img
          src={cat}
          alt=""
          className="absolute bottom-[10px] left-[28%] z-[4] h-auto w-[33.6111%] max-w-none select-none"
        />
        <img
          src={tree1}
          alt=""
          className="absolute bottom-0 left-0 z-[5] h-auto w-[41.8056%] max-w-none select-none"
        />
        <img
          src={tree2}
          alt=""
          className="absolute bottom-0 left-[52%] z-[6] h-auto w-[41.8056%] max-w-none select-none"
        />
      </div>

      <div className="absolute top-[21%] left-5 right-5 z-10 flex flex-col items-start font-poppins md:left-[5.56cqw] md:right-auto">
        {/* Each letter drops in on load, and hops when the mouse passes over it. */}
        <h1
          aria-label={TITLE}
          className="m-0 text-[clamp(2.5rem,10vw,4rem)] leading-[1.05] font-bold tracking-[-0.02em] whitespace-pre text-[#c4ecfd] [text-shadow:0_0_2.5cqw_rgba(196,236,253,0.35)] md:text-[5.1cqw]"
        >
          {[...TITLE].map((char, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{ animationDelay: `${i * 0.05}s` }}
              className="inline-block animate-[letter-drop_0.7s_cubic-bezier(0.2,0.7,0.3,1)_both] transition-[translate,color] duration-200 hover:-translate-y-[0.6cqw] hover:text-white motion-reduce:animate-none motion-reduce:hover:translate-none"
            >
              {char}
            </span>
          ))}
        </h1>
        <p style={{ animationDelay: "0.6s" }} className={`m-0 mt-3 text-sm leading-normal font-light text-[#cfc6e9] md:mt-[1.15cqw] md:text-[1.05cqw] md:leading-none ${enter}`}>
          January 29th - 31st, 2027 . In-person event . MLH Official Member
        </p>
        <p style={{ animationDelay: "0.75s" }} className={`m-0 mt-6 text-base leading-normal font-medium text-[#cfc6e9] md:mt-[2.5cqw] md:text-[1.15cqw] md:leading-none ${enter}`}>
          Interested in Participating?
        </p>
        <div style={{ animationDelay: "0.9s" }} className={enter}>
          <a
            href="#"
            className="mt-4 inline-block cursor-pointer animate-[cta-pulse_2.6s_ease-out_1.5s_infinite] rounded-full bg-[#c4ecfd] px-6 py-3 text-base leading-none font-semibold text-[#243056] no-underline transition hover:-translate-y-[0.15cqw] hover:scale-105 hover:bg-white motion-reduce:animate-none motion-reduce:hover:translate-none motion-reduce:hover:scale-100 md:mt-[1.15cqw] md:px-[1.55cqw] md:py-[0.55cqw] md:text-[1.05cqw]"
          >
            Hack With Us!
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
