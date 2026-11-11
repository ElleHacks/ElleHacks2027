import seaRocks from "../../assets/ContactUs/searocks.png";
import seaFloor from "../../assets/ContactUs/Sea 1.png";
import reef from "../../assets/ContactUs/Sea 2.png";
import kelp1 from "../../assets/ContactUs/kelp 1.png";
import kelp2 from "../../assets/ContactUs/kelp 2.png";
import kelp3 from "../../assets/ContactUs/kelp 3.png";
import kelp4 from "../../assets/ContactUs/kelp 4.png";
import linkedinIcon from "../../assets/ContactUs/LinkedIn-icon.svg";
import instagramIcon from "../../assets/ContactUs/instagram-icon.svg";
import facebookIcon from "../../assets/ContactUs/facebook-icon.svg";
import xIcon from "../../assets/ContactUs/x-icon.svg";
import tiktokIcon from "../../assets/ContactUs/tiktok-icon.svg";
import mailIcon from "../../assets/ContactUs/mail-icon.svg";
import Reveal from "../Reveal/Reveal";
import { Bubbles, FishSchool, LightRays } from "../Ambient/Ambient";
import { Crab, Jellyfish, SwimmingFish, Turtle } from "../SeaLife/SeaLife";
import locationFish from "../../assets/Location/fish.png";
import silverFish from "../../assets/InterestedInSponsoring/silver-fish.png";
import { bloop } from "../../audio/seaSound";

const socials = [
  { label: "Facebook", href: "https://www.facebook.com/ellehacks/", icon: facebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/ellehacks", icon: instagramIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/ellehacks", icon: linkedinIcon },
  { label: "Email questions@ellehacks.com", href: "mailto:questions@ellehacks.com", icon: mailIcon },
  { label: "X", href: "https://x.com/ellehacks", icon: xIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@ellehacks", icon: tiktokIcon },
];

// Each kelp sways from its roots at its own pace, so they never move in step.
const kelpSway = "origin-bottom animate-[sway_ease-in-out_infinite] motion-reduce:animate-none";

const buttonClass =
  "group pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#131c34] shadow-[0_0.4cqw_1.2cqw_rgba(5,10,30,0.35)] transition hover:-translate-y-[0.2cqw] hover:bg-[#273659] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4ecfd] md:h-[5.2cqw] md:w-[5.2cqw]";

function ContactUs() {
  return (
    <section
      className="@container relative min-h-[36rem] w-full overflow-hidden bg-[linear-gradient(180deg,#2c488c_0%,#20306a_55%,#131c34_100%)] md:aspect-[2880/2048] md:min-h-0"
      aria-labelledby="contact-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={seaRocks}
          alt=""
          className="absolute inset-0 z-[1] h-full w-full max-w-none object-fill select-none"
        />
        <img
          src={reef}
          alt=""
          className="absolute top-[2%] right-[-3%] z-[2] h-auto w-[21.5278%] max-w-none select-none"
        />
        <img
          src={seaFloor}
          alt=""
          className="absolute bottom-0 left-0 z-[3] h-auto w-full max-w-none select-none"
        />
        <LightRays className="z-[2]" />
        <FishSchool src={silverFish} top="12%" duration={34} className="z-[2]" />
        <Turtle top="52%" size={11} duration={44} delay={-25} className="z-[2]" />
        <Jellyfish left="9%" top="18%" size={5} className="z-[2]" />
        <Jellyfish left="83%" top="36%" size={4} hue="blue" delay={-4} className="z-[2]" />
        <SwimmingFish src={locationFish} faces="right" top="68%" width={4.5} duration={30} delay={-10} tilt={20} className="z-[2]" />
        <Crab left="14%" bottom="5%" size={5} className="z-[5]" />
        <Bubbles rise={60} className="z-[3]" />
        <img
          src={kelp1}
          alt=""
          style={{ animationDuration: "6s", animationDelay: "0s", "--sway": "3deg" }}
          className={`${kelpSway} absolute bottom-[6%] left-[30%] z-[4] h-auto w-[12.9167%] max-w-none select-none`}
        />
        <img
          src={kelp2}
          alt=""
          style={{ animationDuration: "7.5s", animationDelay: "-2s", "--sway": "3deg" }}
          className={`${kelpSway} absolute bottom-[3%] left-[44%] z-[4] h-auto w-[13.7847%] max-w-none select-none`}
        />
        <img
          src={kelp3}
          alt=""
          style={{ animationDuration: "6.8s", animationDelay: "-4s", "--sway": "3deg" }}
          className={`${kelpSway} absolute bottom-[8%] left-[64%] z-[4] h-auto w-[12.6736%] max-w-none select-none`}
        />
        <img
          src={kelp4}
          alt=""
          style={{ animationDuration: "8s", animationDelay: "-1s", "--sway": "3deg" }}
          className={`${kelpSway} absolute right-[4%] bottom-[2%] z-[4] h-auto w-[11.8056%] max-w-none select-none`}
        />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center px-4 pb-20 pt-32 text-center md:absolute md:top-[28%] md:left-1/2 md:w-[66%] md:-translate-x-1/2 md:px-0 md:pb-0 md:pt-0">
        <Reveal
          as="h2"
          id="contact-heading"
          className="m-0 font-['Poppins'] text-3xl leading-[1.29] font-bold text-[#FFEFD8] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)] md:text-[3.82cqw]"
        >
          Get in Contact With Us
        </Reveal>

        <ul className="m-0 mt-8 flex list-none flex-wrap justify-center gap-4 p-0 md:mt-[3cqw] md:flex-nowrap md:gap-[2cqw]">
          {socials.map((social, i) => {
            const isEmail = social.href.startsWith("mailto:");
            return (
              <Reveal as="li" key={social.label} delay={0.15 + i * 0.08}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  className={buttonClass}
                  onMouseEnter={() => bloop(1 + i * 0.12)}
                  {...(isEmail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <img src={social.icon} alt="" className="h-6 w-6 object-contain group-hover:animate-[wiggle_0.5s_ease-in-out] motion-reduce:group-hover:animate-none md:h-[2.4cqw] md:w-[2.4cqw]" />
                </a>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default ContactUs;
