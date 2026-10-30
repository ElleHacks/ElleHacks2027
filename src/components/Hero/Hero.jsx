import heroBack from "../../assets/Hero/Hero-Back.png";
import block from "../../assets/Hero/Block.png";
import cat from "../../assets/Hero/Cat.png";
import house from "../../assets/Hero/House.png";
import tree2 from "../../assets/Hero/tree 2.png";
import tree1 from "../../assets/Hero/tree1.png";

function Hero() {
  return (
    <section className="@container relative w-full aspect-[2880/2048] overflow-hidden bg-[linear-gradient(180deg,#202c49_17.79%,#433589_100%)]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={heroBack}
          alt=""
          className="absolute inset-0 h-full w-full max-w-none object-fill select-none"
        />
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

      <div className="absolute top-[21%] left-[5.56cqw] z-10 flex flex-col items-start font-poppins">
        <h1 className="m-0 text-[5.1cqw] leading-[1.05] font-bold tracking-[-0.02em] text-[#c4ecfd]">
          ElleHacks 2027
        </h1>
        <p className="m-0 mt-[1.15cqw] text-[1.05cqw] leading-none font-light text-[#cfc6e9]">
          January 2027 . In-person event . MLH official Member
        </p>
        <p className="m-0 mt-[2.5cqw] text-[1.15cqw] leading-none font-medium text-[#cfc6e9]">
          Interested in Participating?
        </p>
        <a
          href="#"
          className="mt-[1.15cqw] inline-block cursor-pointer rounded-full bg-[#c4ecfd] px-[1.55cqw] py-[0.55cqw] text-[1.05cqw] leading-none font-semibold text-[#243056] no-underline transition hover:bg-white"
        >
          Hack With Us!
        </a>
      </div>
    </section>
  );
}

export default Hero;
