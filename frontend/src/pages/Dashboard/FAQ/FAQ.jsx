import { useEffect, useRef, useState } from "react";
// Same chat-bubble icon as the sidebar's FAQ link, already drawn in cream
import iconFaq from "../../../assets/Dashboard/icon-faq.svg";
import fade from "../../../assets/Dashboard/faq-fade.png";

const faqs = [
  {
    question: "When and where is ElleHacks?",
    answer:
      "ElleHacks will be hosted in-person at York University. More location details will be provided closer to the event date.",
  },
  {
    question: "What’s a Hackathon?",
    answer:
      "A Hackathon is an event where individuals come together to brainstorm, collaborate, and build creative solutions to real-world problems. Whether you’re a coder, designer, entrepreneur, or simply curious, ElleHacks gives you an opportunity to learn new skills, create innovation projects, make new friends, network with recruiters, and pick up cool skills through workshops, speaker sessions, games, and activities!",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "Nope! Students of all skill levels are welcome at ElleHacks (even if you have absolutely zero experience)! Tons of hackathon participants are total newbies, and we’ll be there to support you through workshops and mentorship.",
  },
  {
    question: "Who can apply?",
    answer:
      "We welcome all students from underrepresented gender groups (i.e., women and gender-diverse students) who either live or attend school in North America. Only students who are currently enrolled at a high school or college/university, or have graduated within the past 12 months, are eligible to attend. You must bring a valid student or government-issued ID card for admission.",
  },
  {
    question: "What in-person accommodations are available?",
    answer:
      "Hackers have the option of staying overnight! You’re free to come and go as you please. Sleeping rooms will be provided.",
  },
  {
    question: "When is the last day to sign up?",
    answer: "Applications will be open closer to the event date. The deadline to apply is TBD.",
  },
  {
    question: "Will there be swag?",
    answer: "Yes!!",
  },
];

function FAQ() {
  const listRef = useRef(null);
  // The bottom fade hints there's more to scroll; drop it once the last answer is in view so it stays readable
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    const update = () => setAtEnd(list.scrollTop + list.clientHeight >= list.scrollHeight - 4);
    update();
    list.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      list.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="dashboard-page faq-page">
      <h1 className="dashboard-page__title">Got questions? We’ve got answers!</h1>

      <div className="faq-scroll">
        <div className="faq-list" ref={listRef} tabIndex={0} aria-label="Frequently asked questions">
          {faqs.map(({ question, answer }) => (
            <section className="faq-item" key={question}>
              <h2 className="faq-item__question">
                <img src={iconFaq} alt="" width="44" height="33" aria-hidden="true" />
                {question}
              </h2>
              <p className="faq-item__answer">{answer}</p>
            </section>
          ))}
        </div>

        <img className={`faq-fade${atEnd ? " is-hidden" : ""}`} src={fade} alt="" aria-hidden="true" />
      </div>
    </div>
  );
}

export default FAQ;
