import block from "../../assets/AboutUs/Block-background.png";
import tree1 from "../../assets/AboutUs/tree1.png";
import smallIce from "../../assets/AboutUs/small-ice.png";
import ice from "../../assets/AboutUs/Ice.png";
import penguin from "../../assets/AboutUs/penguin.png";
import oldLogo from "../../assets/AboutUs/old-logo.png";

const imagePlaceholderStyle = {
  backgroundColor: "#f4f4f4",
  backgroundImage: "repeating-conic-gradient(#d3d3d3 0% 25%, #f7f7f7 0% 50%)",
  backgroundSize: "1.35cqw 1.35cqw",
};

function AboutUs() {
  return (
    <section
      className="@container relative w-full aspect-[2880/2048] overflow-hidden bg-[linear-gradient(180deg,#7a5c71_0%,#2c488c_48.56%,#8b9ab4_100%)]"
      aria-labelledby="about-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={block}
          alt=""
          className="absolute inset-0 z-[1] h-full w-full max-w-none object-fill select-none"
        />
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
        <img
          src={penguin}
          alt=""
          className="absolute right-[0%] bottom-[13%] z-[11] h-auto w-[18.9583%] max-w-none select-none"
        />
      </div>

      <h2
        id="about-heading"
        className="absolute top-[15%] left-1/2 z-10 m-0 -translate-x-1/2 text-center font-poppins text-[3.8cqw] leading-[1.1] font-bold text-[#ffefd8]"
      >
        About
      </h2>

      <div className="absolute top-[27%] right-[10%] left-[5.56cqw] z-10 flex items-start gap-[2.6cqw] font-poppins">
        <div className="w-[62%] shrink-0 rounded-[2.5cqw] bg-[#060E22]/80 px-[3cqw] pt-[4cqw] pb-[4cqw]">
          <p className="m-0 text-[1.75cqw] leading-[1.35] font-bold text-[#ffefd8]">
            ElleHacks is Canada&apos;s largest hackathon for women and gender-diverse students,
            celebrating our 10th year anniversary!
          </p>
          <p className="m-0 mt-[2.5cqw] text-[1.35cqw] leading-[1.5] font-normal text-[#d5deea]">
            We&apos;re a free, student-run, and beginner-friendly competition serving as your canvas
            to pitch bold solutions to global challenges, participate in engaging workshops, and
            connect with a diverse community of recruiters, industry professionals, and peers.
          </p>
          <p className="m-0 mt-[2.5cqw] text-[1.35cqw] leading-[1.5] font-normal text-[#d5deea]">
            No coding experience? No problem! ElleHacks is designed for everyone, from tech
            enthusiasts to those taking their first steps in the digital world.
          </p>
          <a
            href="#"
            className="mt-[3cqw] inline-block rounded-full bg-[#c4ecfd] px-[1.55cqw] py-[1.55cqw] text-[1.5cqw] leading-none font-semibold text-[#243056] no-underline transition hover:bg-white"
          >
            Hack With Us!
          </a>
        </div>

        <div className="ml-[3cqw] min-w-0 flex-1">
          <div className="flex items-center gap-[2cqw]">
            <img
              src={oldLogo}
              alt="ElleHacks logo"
              className="aspect-square w-[46%] shrink-0 object-contain"
            />
            <p className="m-0 text-[1.55cqw] leading-[1.25] font-bold text-[#ffefd8]">
              {/*Introducing
              <br />
              Our New Logo!*/}
            </p>
          </div>
          <div
            className="mt-[1.8cqw] aspect-[8/5] w-full rounded-[2.5cqw]"
            style={imagePlaceholderStyle}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
