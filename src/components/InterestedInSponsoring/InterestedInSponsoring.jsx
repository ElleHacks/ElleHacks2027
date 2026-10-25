import { useState } from 'react';
import { useInView } from '../../hooks/useInView';

import iceberg from "../../assets/InterestedInSponsoring/Ice-berg.png";
import iceberg1 from "../../assets/InterestedInSponsoring/Ice-berg1.png";
import ice2 from "../../assets/InterestedInSponsoring/Ice2.png";
import fishermanLegs from "../../assets/InterestedInSponsoring/Component 1.png";
import silverFish from "../../assets/InterestedInSponsoring/silver-fish.png";
import fishButton from "../../assets/InterestedInSponsoring/fish-button.svg";

// The serverless function in /api/sponsor-inquiry.js emails the ElleHacks inbox.
const ENDPOINT = import.meta.env.VITE_SPONSOR_ENDPOINT || '/api/sponsor-inquiry';

const STATUS_MESSAGES = {
  sending: 'Sending your message…',
  sent: "Thank you! We'll be in touch with our partnership deck soon.",
  error: 'Something went wrong. Please try again, or email us directly.',
};

const labelClass =
  "flex flex-col gap-1 font-['Poppins'] text-base font-medium text-white md:gap-[0.3cqw] md:text-[1.39cqw]";

const inputClass =
  "w-full rounded-lg border-2 border-[#5B7DB1] bg-white px-3 py-2 font-['Poppins'] text-sm font-normal text-[#2C488C] placeholder:text-[#A65A3A] focus:border-[#FFEFD8] focus:outline-none md:h-[4.1cqw] md:rounded-[0.83cqw] md:px-[1.1cqw] md:py-0 md:text-[1.1cqw]";


function InterestedInSponsoring() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [cardRef, cardInView] = useInView();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('sending');

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const sending = status === 'sending';

  return (
    <section
      className="@container relative w-full overflow-clip bg-[linear-gradient(180deg,#45b8e4_0%,#2ea7dc_100%)] px-4 py-12 md:aspect-[1440/1024] md:p-0"
      aria-labelledby="iis-heading"
    >
      {/* Positions come from the 1440 x 1024 "Interested in sponsoring" Figma frame. */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden select-none md:block"
        aria-hidden="true"
      >
        <img src={ice2} alt="" className="absolute left-[64.4%] -top-[0.4%] h-auto w-[35.8%] max-w-none animate-[ice-bob_6s_ease-in-out_infinite] motion-reduce:animate-none" />
        <img src={iceberg} alt="" className="absolute left-[8.1%] top-[29.5%] h-auto w-[84.5%] max-w-none" />
        <img src={iceberg1} alt="" className="absolute left-0 top-0 h-auto w-[51.5%] max-w-none" />
        {/* The fisherman's legs; the top half sits at the bottom of the Sponsors section. */}
        <img src={fishermanLegs} alt="" className="absolute left-[11.5%] top-0 h-auto w-[36.7%] max-w-none" />
        <img
          src={silverFish}
          alt=""
          className="absolute left-[81.5%] top-[57%] h-auto w-[9.4%] max-w-none animate-[fish-swim_6s_ease-in-out_infinite] motion-reduce:animate-none"
        />
      </div>

      <div
        ref={cardRef}
        className={`relative z-10 mx-auto max-w-xl rounded-3xl bg-[#1F3459]/90 px-5 pb-24 pt-8 shadow-[0_0.6cqw_1.6cqw_rgba(0,0,0,0.3)] backdrop-blur-[2px] md:absolute md:left-[17.9%] md:top-[8.8%] md:mx-0 md:h-[73.7%] md:w-[64.5%] md:max-w-none md:rounded-[2.8cqw] md:px-[4.5cqw] md:pb-0 md:pt-[3.2cqw] ${
          cardInView
            ? 'animate-[card-rise_0.7s_ease-out_both] motion-reduce:animate-none'
            : 'opacity-0 motion-reduce:opacity-100'
        }`}
      >
        <h2
          id="iis-heading"
          className="m-0 text-center font-['Poppins'] text-4xl font-bold leading-[1.3] text-[#FFEFD8] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)] md:text-[3.33cqw]"
        >
          Sponsor Us!
        </h2>
        <p className="mx-auto mb-0 mt-3 max-w-[52.8cqw] text-center font-['Poppins'] text-base font-semibold leading-[1.6] text-white md:mt-[0.9cqw] md:text-[1.53cqw]">
          Help us provide a space for developers to create, learn, and grow. Fill out the form
          below to receive our partnership deck and see how we can build together.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 md:mt-[2.6cqw] md:gap-[1.5cqw]">
          <label className={labelClass}>
            Email
            <input name="email" type="email" required autoComplete="email" maxLength={200}
              placeholder="Enter your email" className={inputClass} />
          </label>
          <label className={labelClass}>
            Title
            <input name="title" type="text" required maxLength={150}
              placeholder="Enter title here" className={inputClass} />
          </label>
          <label className={labelClass}>
            Message/Content
            <textarea name="message" required rows={4} maxLength={2000}
              placeholder="Enter your message here"
              className={`${inputClass} resize-none md:h-[8.1cqw] md:py-[0.8cqw]`} />
          </label>

          {/* Honeypot: hidden from people, bots fill it in and the server drops the request. */}
          <input name="website" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <p
            role="status"
            aria-live="polite"
            className={`m-0 min-h-[1.5em] max-w-[70%] font-['Poppins'] text-sm font-medium md:-mt-[0.6cqw] md:text-[1.05cqw] ${
              status === 'error' ? 'text-[#FFB4A8]' : 'text-[#FFEFD8]'
            }`}
          >
            {STATUS_MESSAGES[status] ?? ''}
          </p>

          <button
            type="submit"
            disabled={sending}
            className={`group absolute bottom-4 right-2 w-44 transition-[scale,filter] duration-300 hover:scale-105 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFEFD8] disabled:cursor-wait motion-reduce:hover:scale-100 md:-right-[2.2cqw] md:bottom-[0.35cqw] md:w-[17.6cqw] ${
              sending ? 'animate-[fish-pop_0.6s_ease-in-out_infinite] motion-reduce:animate-none' : ''
            }`}
          >
            <img
              src={fishButton}
              alt=""
              className="h-auto w-full select-none group-hover:animate-[fish-pop_0.5s_ease-out] motion-reduce:group-hover:animate-none"
            />
            <span className="absolute inset-0 flex items-center justify-center pr-[22%] pt-[12%] font-['Poppins'] text-xl font-semibold text-white md:text-[1.94cqw]">
              {sending ? 'Sending…' : 'Submit'}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}

export default InterestedInSponsoring;
