import { useState } from 'react';

import Ice1 from "../../assets/FAQ/Ice 1.png";
import Ice2 from "../../assets/FAQ/Ice 2.png";
import Ice3 from "../../assets/FAQ/Ice 3.png";
import Ice4 from "../../assets/FAQ/Ice 4.png";
import polar from "../../assets/FAQ/polar-bear.png";
import arrow from "../../assets/FAQ/play_arrow_filled.svg";

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
  setOpenIds((currentIds) =>
    currentIds.includes(id) ? [] : [id]
  );
};

 return (
  <section className="@container relative min-h-[75.42cqw] w-full overflow-clip bg-[linear-gradient(180deg,#17A6D4_0%,#2D80BB_100%)]">
    
    <div
      className="pointer-events-none absolute left-0 top-0 z-0 aspect-[2880/2172] w-full select-none"
      aria-hidden="true"
    >
      <img src={Ice1} alt="" className="absolute left-[68.61%] top-0 h-auto w-[31.74%] max-w-none" />
      <img src={Ice2} alt="" className="absolute left-0 top-[74.77%] h-auto w-[27.4%] max-w-none" />

      {/* Ice3 + polar bear + Ice4 group */}
      <div className="absolute left-[40%] top-[50.5%] w-[61%]">
        <img src={Ice3} alt="" className="h-auto w-full max-w-none" />
        <img src={polar} alt="" className="absolute left-[30%] top-[-39%] h-auto w-[70%] max-w-none " />
        <img src={Ice4} alt="" className="absolute left-[33.88%] top-[85%] h-auto w-[26.18%] max-w-none" />
      </div>
    </div>

  
    <div className="relative z-10 box-border min-h-[75.42cqw] pb-[5cqw] pt-[12.3cqw]">
      <h2 className="absolute left-[5.56cqw] top-[6cqw] w-[51.8cqw] whitespace-nowrap text-left font-['Poppins'] text-[3.82cqw] font-bold leading-[1.29] text-[#FFEFD8] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]">
        FAQ
      </h2>

      <div className="ml-[5.56cqw] flex w-[51.8cqw] flex-col gap-[1.94cqw]">
        {initialFaqData.map((item) => {
          const isOpen = openIds.includes(item.id);
          const contentId = `faq-answer-${item.id}`;

  return (
            <div
              key={item.id}
              className={`w-full shrink-0 overflow-hidden bg-[#C4ECFD] px-[1.67cqw] transition-all duration-300 hover:-translate-y-[2px] motion-reduce:hover:translate-y-0 ${
                   isOpen
              ? 'min-h-[12.92cqw] rounded-[2.08cqw] pb-[1.67cqw] pt-[1.11cqw] shadow-md'
             : 'h-[4.38cqw] rounded-[2.08cqw] py-[1.11cqw]'
            }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="flex h-[2.08cqw] w-full items-center justify-between gap-[2%] text-left"
                aria-expanded={isOpen}
                aria-controls={contentId}
              >
                <span className="flex-1 font-['Poppins'] text-[1.39cqw] font-semibold leading-[1.5] text-[#0C183B]">
                  {item.question}
                </span>

                <img
                  src={arrow}
                  alt=""
                  aria-hidden="true"
                  className={`h-[1.67cqw] w-[1.67cqw] shrink-0 select-none transition-transform duration-300 ${
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
                  <div className="mt-[1.67cqw] min-h-[6.39cqw] rounded-[1.11cqw] bg-[#2C488C] px-[1.11cqw] py-[1.11cqw] font-['Poppins'] text-[1.39cqw] font-semibold leading-[1.5] text-white">
                    <p>{renderAnswer(item.answer)}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
  );
}