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
    question: 'What’s a hackathon?',
    answer:
      "At ElleHacks, you'll get to make tons of new friends, network with recruiters, and pick up cool skills through workshops, speaker sessions, activities, and games!",
  },
  {
    id: '3',
    question: 'Do I need to know how to code?',
    answer:
      'No prior coding experience is required! We will have introductory workshops, mentors, and resources to help beginners build their first project.',
  },
  {
    id: '4',
    question: 'Who can apply?',
    answer:
      'ElleHacks welcomes female and non-binary students of all skill levels from high school to post-secondary education.',
  },
  {
    id: '5',
    question: 'Is ElleHacks in-person or virtual?',
    answer:
      'ElleHacks 2027 will be an in-person event hosted at York University.',
  },
  {
    id: '6',
    question: 'When will applications open?',
    answer:
      'Applications will open soon! Keep an eye on our social media and website for updates.',
  },
  {
    id: '7',
    question: 'MLH Code of Conduct',
    answer:
      'All attendees, sponsors, and staff are required to adhere to the Major League Hacking (MLH) Code of Conduct throughout the event.',
  },
];

export default function FAQ() {
  const [openIds, setOpenIds] = useState(['1', '2']);

  const toggleItem = (id) => {
    setOpenIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id]
    );
  };

 return (
  <section className="@container relative w-full aspect-[2880/2172] overflow-clip bg-[linear-gradient(180deg,#17A6D4_0%,#2D80BB_100%)]">
    
    <div
      className="pointer-events-none absolute inset-0 z-0 select-none"
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

  
    <div className="relative z-10 pb-[3cqw] pt-[14.72cqw]">
      <h2 className="absolute left-[34.1%] top-[6cqw] w-[7.78%] whitespace-nowrap text-center font-['Crimson_Text'] text-[3.82cqw] font-bold leading-[1.29] text-[#FFEFD8] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]">
        FAQ
      </h2>

      <div className="ml-[11.18%] flex w-[53.61%] flex-col gap-[1.46cqw]">
        {initialFaqData.map((item) => {
          const isOpen = openIds.includes(item.id);
          const contentId = `faq-answer-${item.id}`;

  return (
            <div
              key={item.id}
              className={`overflow-hidden bg-[#C4ECFD] px-[1.6cqw] transition-all duration-300 ${
                isOpen
                  ? 'min-h-[9.93cqw] rounded-[2.57cqw] pb-[0.76cqw] shadow-md'
                  : 'h-[max(4.38cqw,44px)] rounded-[4.65cqw]'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`flex w-full items-center justify-between gap-[2%] text-left ${
                  isOpen ? 'h-[max(3.89cqw,44px)]' : 'h-[max(4.38cqw,44px)]'
                }`}
                aria-expanded={isOpen}
                aria-controls={contentId}
              >
                <span className="flex-1 pl-[0.97cqw] font-['Crimson_Text'] text-[1.45cqw] font-semibold leading-[1.3] text-[#0C183B]">
                  {item.question}
                </span>

                <img
                  src={arrow}
                  alt=""
                  aria-hidden="true"
                  className={`h-[max(2cqw,16px)] w-[max(2cqw,16px)] shrink-0 select-none transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : 'rotate-0'
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
                  <div className="min-h-[5.28cqw] rounded-[1.74cqw] bg-[#2C488C] pb-[0.9cqw] pl-[2.01cqw] pr-[1.81cqw] pt-[0.76cqw] font-['Crimson_Text'] text-[1.45cqw] font-semibold leading-[1.3] text-white">
                    <p>{item.answer}</p>
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