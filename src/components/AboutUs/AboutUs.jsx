import block from "../../assets/AboutUs/Block-background.png";
import tree1 from "../../assets/AboutUs/tree1.png";
import smallIce from "../../assets/AboutUs/small-ice.png";
import ice from "../../assets/AboutUs/Ice.png";
import penguin from "../../assets/AboutUs/penguin.png";
import logo from "../../assets/AboutUs/new-logo.png";
import Reveal from "../Reveal/Reveal";
import { Snow } from "../Ambient/Ambient";
import { bloop } from "../../audio/seaSound";

const imagePlaceholderStyle = {
  backgroundColor: "#f4f4f4",
  backgroundImage: "repeating-conic-gradient(#d3d3d3 0% 25%, #f7f7f7 0% 50%)",
  backgroundSize: "1.35cqw 1.35cqw",
};

function AboutUs() {
  return (
    <section
      className="@container relative min-h-[44rem] w-full overflow-hidden bg-[linear-gradient(180deg,#7a5c71_0%,#2c488c_48.56%,#8b9ab4_100%)] md:aspect-[2880/2048] md:min-h-0"
      aria-labelledby="about-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={block}
          alt=""
          className="absolute inset-0 z-[1] h-full w-full max-w-none object-fill select-none"
        />
        <Snow fall={72} className="z-[1]" />
        <img
          src={tree1}
          alt=""
          className="absolute top-0 left-0 z-[2] h-auto w-[41.8056%] max-w-none select-none"
        />
        <img
          src={smallIce}
          alt=""
          className="absolute top-[0%] left-[52%] z-[2] h-auto w-[41.8056%] max-w-none select-none"
        />
        <img
          src={ice}
          alt=""
          className="absolute right-0 bottom-0 z-[2] h-auto w-[41.1806%] max-w-none select-none"
        />
        <div
          className="pointer-events-auto absolute right-[0%] bottom-[13%] z-[11] w-[18.9583%] cursor-pointer"
          onMouseEnter={() => bloop(0.8)}
        >
          <img
            src={penguin}
            alt=""
            className="h-auto w-full max-w-none select-none hover:animate-[penguin-float_1.6s_ease-in-out_infinite] motion-reduce:hover:animate-none"
          />
        </div>
      </div>

      <Reveal
        as="h2"
        id="about-heading"
        className="relative z-10 m-0 pt-10 text-center font-poppins text-4xl leading-[1.1] font-bold text-[#ffefd8] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)] md:absolute md:top-[15%] md:left-1/2 md:-translate-x-1/2 md:pt-0 md:text-[3.8cqw]"
      >
        About
      </Reveal>

      <div className="relative z-10 mt-6 flex flex-col items-stretch gap-6 px-4 pb-20 font-poppins md:absolute md:top-[27%] md:right-[10%] md:left-[5.56cqw] md:mt-0 md:flex-row md:items-start md:gap-[2.6cqw] md:px-0 md:pb-0">
        <Reveal
          delay={0.1}
          className="w-full shrink-0 rounded-3xl bg-[#060E22]/80 p-6 transition-shadow duration-500 hover:shadow-[0_0_3cqw_rgba(196,236,253,0.25)] md:w-[62%] md:rounded-[2.5cqw] md:px-[3cqw] md:pt-[4cqw] md:pb-[4cqw]"
        >
          <p className="m-0 text-base leading-[1.5] font-bold text-[#ffefd8] md:text-[1.75cqw] md:leading-[1.35]">
            ElleHacks is Canada&apos;s largest hackathon for women and gender-diverse students,
            celebrating our 10th year anniversary!
          </p>
          <p className="m-0 mt-4 text-sm leading-[1.6] font-normal text-[#d5deea] md:mt-[2.5cqw] md:text-[1.35cqw] md:leading-[1.5]">
            We&apos;re a free, student-run, and beginner-friendly competition serving as your canvas
            to pitch bold solutions to global challenges, participate in engaging workshops, and
            connect with a diverse community of recruiters, industry professionals, and peers.
          </p>
          <p className="m-0 mt-4 text-sm leading-[1.6] font-normal text-[#d5deea] md:mt-[2.5cqw] md:text-[1.35cqw] md:leading-[1.5]">
            No coding experience? No problem! ElleHacks is designed for everyone, from tech
            enthusiasts to those taking their first steps in the digital world.
          </p>
          <a
            href="#"
            className="mt-5 inline-block rounded-full bg-[#c4ecfd] px-5 py-3 text-sm leading-none font-semibold text-[#243056] no-underline transition hover:-translate-y-[0.15cqw] hover:scale-105 hover:bg-white hover:shadow-[0_0.5cqw_1.5cqw_rgba(196,236,253,0.4)] motion-reduce:hover:translate-none motion-reduce:hover:scale-100 md:mt-[3cqw] md:px-[1.55cqw] md:py-[1.55cqw] md:text-[1.5cqw]"
          >
            Hack With Us!
          </a>
        </Reveal>

        <Reveal delay={0.25} className="min-w-0 flex-1 md:ml-[3cqw]">
          <div className="flex items-center gap-[2cqw]">
            <img
              src={logo}
              alt="ElleHacks logo"
              className="aspect-square w-[32%] shrink-0 object-contain transition-transform duration-700 hover:rotate-[360deg] hover:scale-105 motion-reduce:transition-none md:w-[46%]"
            />
            <p className="m-0 text-base leading-[1.25] font-bold text-[#ffefd8] md:text-[1.55cqw]">
              Introducing
              <br />
              Our New Logo!
            </p>
          </div>
          <div
            className="mt-4 aspect-[8/5] w-full rounded-3xl md:mt-[1.8cqw] md:rounded-[2.5cqw]"
            style={imagePlaceholderStyle}
            aria-hidden="true"
          />
        </Reveal>
      </div>
    </section>
  );
}

export default AboutUs;
