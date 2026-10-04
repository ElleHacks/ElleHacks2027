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

      <div className="absolute top-[20%] left-[8.5%] z-10 flex flex-col items-start">
        <h1 className="m-0 text-[6cqw] leading-[1.1] font-[625] tracking-[0.1cqw] text-[#c4ecfd]">
          ElleHacks 2027
        </h1>
        <p className="m-0 mt-[0.8cqw] text-[1.3cqw] font-thin tracking-[0.08cqw] text-[#cfc6e9]">
          January 2027 . In-person event . MLH official Member
        </p>
        <a
          href="#"
          className="mt-[1.8cqw] inline-block cursor-pointer rounded-full bg-[#c4ecfd] px-[4cqw] py-[0.5cqw] text-[1.4cqw] font-extrabold text-[#273659] no-underline transition hover:bg-white"
        >
          Interested in Participating?
        </a>
      </div>
    </section>
  );
}

export default Hero;
