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

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/ellehacks", icon: linkedinIcon },
  { label: "Instagram", href: "https://www.instagram.com/ellehacks", icon: instagramIcon },
  { label: "Facebook", href: "https://www.facebook.com/ellehacks/", icon: facebookIcon },
  { label: "X", href: "https://x.com/ellehacks", icon: xIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@ellehacks", icon: tiktokIcon },
  { label: "Email questions@ellehacks.com", href: "mailto:questions@ellehacks.com", icon: mailIcon },
];

const buttonClass =
  "pointer-events-auto flex h-[5.2cqw] w-[5.2cqw] items-center justify-center rounded-full bg-[#131c34] shadow-[0_0.4cqw_1.2cqw_rgba(5,10,30,0.35)] transition hover:-translate-y-[0.2cqw] hover:bg-[#273659] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4ecfd]";

function ContactUs() {
  return (
    <section
      className="@container relative w-full aspect-[2880/2048] overflow-hidden bg-[linear-gradient(180deg,#2c488c_0%,#20306a_55%,#131c34_100%)]"
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
        <img
          src={kelp1}
          alt=""
          className="absolute bottom-[6%] left-[30%] z-[4] h-auto w-[12.9167%] max-w-none select-none"
        />
        <img
          src={kelp2}
          alt=""
          className="absolute bottom-[3%] left-[44%] z-[4] h-auto w-[13.7847%] max-w-none select-none"
        />
        <img
          src={kelp3}
          alt=""
          className="absolute bottom-[8%] left-[64%] z-[4] h-auto w-[12.6736%] max-w-none select-none"
        />
        <img
          src={kelp4}
          alt=""
          className="absolute right-[4%] bottom-[2%] z-[4] h-auto w-[11.8056%] max-w-none select-none"
        />
      </div>

      <div className="absolute top-[28%] left-1/2 z-10 flex w-[66%] -translate-x-1/2 flex-col items-center text-center">
        <h2
          id="contact-heading"
          className="m-0 font-['Poppins'] text-[3.82cqw] leading-[1.29] font-bold text-[#FFEFD8] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]"
        >
          Get in Contact With Us
        </h2>

        <ul className="m-0 mt-[3cqw] flex list-none flex-nowrap justify-center gap-[2cqw] p-0">
          {socials.map((social) => {
            const isEmail = social.href.startsWith("mailto:");
            return (
              <li key={social.label}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  className={buttonClass}
                  {...(isEmail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <img src={social.icon} alt="" className="h-[2.4cqw] w-[2.4cqw] object-contain" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default ContactUs;
