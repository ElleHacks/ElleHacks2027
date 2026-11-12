import { useState } from 'react';

import Ice1 from "../../assets/FAQ/Ice 1.png";
import Ice2 from "../../assets/FAQ/Ice 2.png";
import Ice3 from "../../assets/FAQ/Ice 3.png";
import Ice4 from "../../assets/FAQ/Ice 4.png";
import polar from "../../assets/FAQ/polar-bear.png";
import arrow from "../../assets/FAQ/play_arrow_filled.svg";
import Reveal from "../Reveal/Reveal";
import { Snow } from "../Ambient/Ambient";
import { SwimmingFish } from "../SeaLife/SeaLife";
import silverFish from "../../assets/InterestedInSponsoring/silver-fish.png";
import { bloop } from "../../audio/seaSound";

const initialFaqData = [
  {
    id: '1',
    question: 'When and where is ElleHacks?',
    answer:
      'ElleHacks will be hosted at York University (Keele Campus) in Toronto, Ontario, Canada.',
  },
  {
    id: '2',
    question: "What's a hackathon?",
    answer:
      "At ElleHacks, you'll get to make tons of new friends, network with recruiters, and pick up cool skills through workshops, speaker sessions, activities, and games!",
  },
  {
    id: '3',
    question: 'Do I need to know how to code?',
    answer:
      "Nope! Students of all skill levels are welcome at ElleHacks (even if you have absolutely zero experience)! Tons of hackathon participants are total newbies, and we'll be there to support you through workshops and mentorship. :) Still not sure? Check this out for inspiration: https://medium.com/tfogo/hackathons-are-for-beginners-77e9c9cb000#.cj21niskl",
  },
  {
    id: '4',
    question: 'Who can apply?',
    answer:
      'We welcome all students from underrepresented gender groups (i.e., women and gender-diverse students) who either live or attend school in North America. Only students who are currently enrolled in college/university, or have graduated within the past 12 months, are eligible to attend. You must bring a valid student or government-issued ID card for admission.',
  },
  {
    id: '5',
    question: 'Is ElleHacks in-person or virtual?',
    answer:
      'Yes! ElleHacks will be in-person at York University in Toronto. There will be no option to participate in the event virtually.',
  },
  {
    id: '6',
    question: 'When will applications open?',
    answer:
      'Applications are not open yet. We’ll share application dates and details closer to our scheduled event date. Follow our Instagram for the latest updates and announcements so you don’t miss when applications go live.',
  },
  {
    id: '7',
    question: 'MLH Code of Conduct',
    answer: 'https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md',
  },
];

const renderAnswer = (text) =>
  text.split(/(https?:\/\/\S+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all underline"
      >
        {part}
      </a>
    ) : (
      part
    )
  );

export default function FAQ() {
  const [openIds, setOpenIds] = useState([]);
  const toggleItem = (id) => {
  bloop(openIds.includes(id) ? 0.8 : 1.1);
  setOpenIds((currentIds) =>
    currentIds.includes(id) ? [] : [id]
  );
};

 return (
  <section className="@container relative min-h-[32rem] w-full overflow-clip bg-[linear-gradient(180deg,#17A6D4_0%,#2D80BB_100%)] md:min-h-[75.42cqw]">
    
    {/* Fish shadows gliding under the ice. */}
    <SwimmingFish src={silverFish} top="30%" width={6} duration={32} tilt={25} opacity={0.35} className="z-0 blur-[2px]" />
    <SwimmingFish src={silverFish} top="62%" width={4} duration={24} delay={-14} tilt={25} opacity={0.3} className="z-0 blur-[2px]" />

    <div
      className="pointer-events-none absolute left-0 top-0 z-0 aspect-[2880/2172] w-full select-none"
      aria-hidden="true"
    >
      <img src={Ice1} alt="" className="absolute left-[68.61%] top-0 h-auto w-[31.74%] max-w-none animate-[ice-bob_8s_ease-in-out_infinite] motion-reduce:animate-none" />
      <img src={Ice2} alt="" className="absolute left-0 top-[74.77%] h-auto w-[27.4%] max-w-none animate-[ice-bob_7s_ease-in-out_-3s_infinite] motion-reduce:animate-none" />

      {/* Ice3 + polar bear + Ice4 group: the bear rides the floe as it bobs */}
      <div className="absolute left-[40%] top-[50.5%] w-[61%] animate-[ice-bob_6s_ease-in-out_infinite] motion-reduce:animate-none">
        <img src={Ice3} alt="" className="h-auto w-full max-w-none" />
        <img src={polar} alt="" className="absolute left-[30%] top-[-39%] h-auto w-[70%] max-w-none origin-bottom animate-[breathe_4.5s_ease-in-out_infinite] motion-reduce:animate-none" />
        <img src={Ice4} alt="" className="absolute left-[33.88%] top-[85%] h-auto w-[26.18%] max-w-none animate-[ice-bob_5s_ease-in-out_-2s_infinite] motion-reduce:animate-none" />
      </div>
    </div>
    <Snow className="z-[1]" />

    <div className="relative z-10 box-border pb-12 pt-10 md:min-h-[75.42cqw] md:pb-[5cqw] md:pt-[12.3cqw]">
      <Reveal as="h2" className="relative left-auto top-auto mb-6 w-auto px-5 text-left font-['Poppins'] text-4xl font-bold leading-[1.29] text-[#FFEFD8] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)] md:absolute md:left-[5.56cqw] md:top-[6cqw] md:mb-0 md:w-[51.8cqw] md:whitespace-nowrap md:px-0 md:text-[3.82cqw]">
        FAQ
      </Reveal>

      <div className="mx-4 flex w-auto flex-col gap-3 md:ml-[5.56cqw] md:w-[51.8cqw] md:gap-[1.94cqw]">
        {initialFaqData.map((item, i) => {
          const isOpen = openIds.includes(item.id);
          const contentId = `faq-answer-${item.id}`;

  return (
            <Reveal
              key={item.id}
              delay={i * 0.07}
              className={`w-full shrink-0 overflow-hidden bg-[#C4ECFD] px-4 transition-all duration-300 hover:-translate-y-[2px] motion-reduce:hover:translate-y-0 md:px-[1.67cqw] ${
                   isOpen
              ? 'min-h-[8rem] rounded-2xl pb-4 pt-3 shadow-md md:min-h-[12.92cqw] md:rounded-[2.08cqw] md:px-[1.67cqw] md:pb-[1.67cqw] md:pt-[1.11cqw]'
             : 'min-h-14 rounded-2xl py-2 md:h-[4.38cqw] md:min-h-0 md:rounded-[2.08cqw] md:py-[1.11cqw]'
            }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="flex min-h-10 w-full items-center justify-between gap-3 text-left md:h-[2.08cqw] md:min-h-0 md:gap-[2%]"
                aria-expanded={isOpen}
                aria-controls={contentId}
              >
                <span className="flex-1 font-['Poppins'] text-sm font-semibold leading-[1.5] text-[#0C183B] md:text-[1.39cqw]">
                  {item.question}
                </span>

                <img
                  src={arrow}
                  alt=""
                  aria-hidden="true"
                  className={`h-5 w-5 shrink-0 select-none transition-transform duration-300 md:h-[1.67cqw] md:w-[1.67cqw] ${
                    isOpen ? 'rotate-0' : 'rotate-180'
                  }`}
                />
              </button>

              <div
                id={contentId}
                role="region"
                aria-hidden={!isOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  isOpen
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0 invisible'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="mt-3 min-h-[5rem] rounded-xl bg-[#2C488C] px-3 py-3 font-['Poppins'] text-sm font-semibold leading-[1.5] text-white md:mt-[1.67cqw] md:min-h-[6.39cqw] md:rounded-[1.11cqw] md:px-[1.11cqw] md:py-[1.11cqw] md:text-[1.39cqw]">
                    <p>{renderAnswer(item.answer)}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
  );
}