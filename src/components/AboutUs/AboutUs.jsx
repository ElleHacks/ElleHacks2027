import block from "../../assets/AboutUs/Block-background.png";
import tree1 from "../../assets/AboutUs/tree1.png";
import smallIce from "../../assets/AboutUs/small-ice.png";
import ice from "../../assets/AboutUs/Ice.png";
import penguin from "../../assets/AboutUs/penguin.png";

const imagePlaceholderStyle = {
  backgroundColor: "#ffffff",
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
          className="absolute right-[0%] bottom-[13%] z-[3] h-auto w-[18.9583%] max-w-none select-none"
        />
      </div>

      <h2
        id="about-heading"
        className="absolute top-[18%] left-1/2 z-10 m-0 -translate-x-1/2 text-center text-[4.2cqw] leading-[1.1] font-semibold tracking-[0.08cqw] text-[#ffefd8]"
      >
        About
      </h2>
      <div className="absolute top-[30%] left-[12%] z-10 w-[45%]">
        <p className="m-0 text-[1.8cqw] leading-[1.35] font-semibold tracking-[0.02cqw] text-[#ffefd8]">
          ElleHacks is Canada&apos;s largest hackathon for women and gender-diverse students,
          celebrating our 10th year anniversary!
        </p>
        <p className="m-0 mt-[1.8cqw] text-[1.45cqw] leading-[1.45] font-normal tracking-[0.02cqw] text-[#d5deea]">
          We&apos;re a free, student-run, and beginner-friendly competition serving as your canvas
          to pitch bold solutions to global challenges, participate in engaging workshops, and
          connect with a diverse community of recruiters, industry professionals, and peers.
        </p>
        <p className="m-0 mt-[1.8cqw] text-[1.45cqw] leading-[1.45] font-normal tracking-[0.02cqw] text-[#d5deea]">
          No coding experience? No problem! ElleHacks is designed for everyone, from tech
          enthusiasts to those taking their first steps in the digital world.
        </p>
      </div>

      <div className="absolute top-[30%] right-[14%] z-10 flex w-[24.5%] flex-col gap-[3.2cqw]" aria-hidden="true">
        <div className="aspect-[11/5] w-full rounded-[3.2cqw]" style={imagePlaceholderStyle} />
        <div className="aspect-[11/5] w-full rounded-[3.2cqw]" style={imagePlaceholderStyle} />
      </div>

      <div className="absolute bottom-[2.5%] left-[12%] z-10 w-[50%]">
        <p className="m-0 text-[1.8cqw] leading-[1.2] font-semibold tracking-[0.04cqw] text-[#ffefd8]">
          Introducing Our New Logo!
        </p>
        <div className="mt-[2.2cqw] flex items-center gap-[2.4cqw]">
          <div
            className="aspect-square w-[26%] shrink-0 rounded-full"
            style={imagePlaceholderStyle}
            aria-hidden="true"
          />
          <p className="m-0 max-w-[28cqw] text-[1.45cqw] leading-[1.45] font-normal tracking-[0.01cqw] text-[#d2dbe6]">
            ellehacks ellehacks ellehacks ellehacks ellehacks ellehacks ellehacks ellehacks
            ellehacks ellehacks ellehacks ellehacks ellehacks
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
