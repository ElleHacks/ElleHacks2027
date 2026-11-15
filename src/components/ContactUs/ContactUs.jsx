import seaRocks from "../../assets/ContactUs/searocks.png";
import seaFloor from "../../assets/ContactUs/Sea 1.png";
import reef from "../../assets/ContactUs/Sea 2.png";
import kelp1 from "../../assets/ContactUs/kelp 1.png";
import kelp2 from "../../assets/ContactUs/kelp 2.png";
import kelp3 from "../../assets/ContactUs/kelp 3.png";
import kelp4 from "../../assets/ContactUs/kelp 4.png";
import Sea4 from "../../assets/MeetTheTeam/Sea4.png";
import linkedinIcon from "../../assets/ContactUs/LinkedIn-icon.svg";
import instagramIcon from "../../assets/ContactUs/instagram-icon.svg";
import facebookIcon from "../../assets/ContactUs/facebook-icon.svg";
import xIcon from "../../assets/ContactUs/x-icon.svg";
import tiktokIcon from "../../assets/ContactUs/tiktok-icon.svg";
import mailIcon from "../../assets/ContactUs/mail-icon.svg";
import Reveal from "../Reveal/Reveal";
import { FishSchool } from "../Ambient/Ambient";
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

const buttonClass =
  "group pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#131c34] shadow-[0_0.4cqw_1.2cqw_rgba(5,10,30,0.35)] transition hover:-translate-y-[0.2cqw] hover:bg-[#273659] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4ecfd] md:h-[4.2cqw] md:w-[4.2cqw]";

function ContactUs() {
  return (
    <section
      className="@container relative min-h-[36rem] w-full overflow-hidden bg-[linear-gradient(180deg,#3967AB_0%,#061742_100%)] md:aspect-[2880/2048] md:min-h-0"
      aria-labelledby="contact-heading"
    >
      {/* Desktop-proportion art stage, pinned to the section bottom; scales with width only. */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 isolate aspect-[2880/2048] w-full"
        aria-hidden="true"
      >
        <img
          src={seaRocks}
          alt=""
          className="absolute inset-0 z-[1] h-full w-full max-w-none object-fill select-none"
        />
        {/* Mobile: above searocks, left-aligned; same bottom-pinned scale as the stage. */}
        <img
          src={Sea4}
          alt=""
          className="absolute bottom-[100%] left-0 z-[2] h-auto w-full max-w-none select-none md:hidden"
        />
        <img
          src={reef}
          alt=""
          className="absolute top-[2%] right-[-3%] z-[3] h-auto w-[21.5278%] max-w-none select-none"
        />
        <img
          src={seaFloor}
          alt=""
          className="absolute bottom-0 left-0 z-0 h-auto w-full max-w-none select-none"
        />
        <FishSchool src={silverFish} top="12%" duration={34} className="z-[2]" />
        <Turtle top="40%" size={44} duration={44} delay={-25} faces="left" className="z-[5]" />
        <Jellyfish left="76%" top="11%" size={6} hue="blue" delay={-4} className="z-[2]" />
        <SwimmingFish src={locationFish} faces="right" top="68%" width={4.5} duration={30} delay={-10} tilt={20} className="z-[2]" />
        <Crab right="15%" bottom="15%" size={5} className="z-[5]" />
        <img
          src={kelp1}
          alt=""
          className="absolute bottom-[35%] right-[17%] z-[-1] h-auto w-[12.9167%] max-w-none select-none"
        />
        <img
          src={kelp2}
          alt=""
          className="absolute top-[9.5%] right-[0%] z-[4] h-auto w-[13.7847%] max-w-none select-none"
        />
        <img
          src={kelp3}
          alt=""
          className="absolute bottom-[30%] right-[8%] z-[4] h-auto w-[12.6736%] max-w-none select-none"
        />
        <img
          src={kelp4}
          alt=""
          className="absolute right-[-0.5%] bottom-[28%] z-[4] h-auto w-[11.8056%] max-w-none select-none"
        />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center px-4 pb-20 pt-20 text-center md:absolute md:top-[14%] md:left-1/2 md:w-[66%] md:-translate-x-1/2 md:px-0 md:pb-0 md:pt-0">
        <Reveal
          as="h2"
          id="contact-heading"
          className="m-0 font-['Poppins'] text-2xl leading-[1.29] font-bold text-[#FFEFD8] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)] md:text-[3.2cqw]"
        >
          Get in Contact With Us
        </Reveal>

        <ul className="m-0 mt-6 flex list-none flex-wrap justify-center gap-3 p-0 md:mt-[2.4cqw] md:flex-nowrap md:gap-[1.6cqw]">
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
                  <img src={social.icon} alt="" className="h-4 w-4 object-contain group-hover:animate-[wiggle_0.5s_ease-in-out] motion-reduce:group-hover:animate-none md:h-[1.9cqw] md:w-[1.9cqw]" />
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
