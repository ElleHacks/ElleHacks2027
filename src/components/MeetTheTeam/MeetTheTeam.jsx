import { Fragment, useRef, useState } from 'react';
import { teams } from './teamsData';

import Sea1 from "../../assets/MeetTheTeam/Sea1.png";
import Sea2 from "../../assets/MeetTheTeam/Sea2.png";
import Sea3 from "../../assets/MeetTheTeam/Sea3.png";
import Sea4 from "../../assets/MeetTheTeam/Sea4.png";
import photo from "../../assets/MeetTheTeam/Photoframe.png";
import onclickfish from "../../assets/MeetTheTeam/fish-button-onclick.svg";
import fish from "../../assets/MeetTheTeam/fish-button.svg";


function MeetTheTeam() {
  const sectionRef = useRef(null);
  const [activeId, setActiveId] = useState(teams[0].id);
  const [bubbles, setBubbles] = useState([]);

  const releaseBubbles = (button) => {
    const section = sectionRef.current.getBoundingClientRect();
    const rect = button.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2 - section.left) / section.width) * 100;
    const y = ((rect.top + rect.height / 2 - section.top) / section.height) * 100;

    const batch = Date.now();
    const fresh = Array.from({ length: 14 }, (_, i) => ({
      key: `${batch}-${i}`,
      batch,
      ripple: i === 0,
      x: `${x}%`,
      y: `${y}%`,
      offset: (Math.random() - 0.5) * 12,
      dx: (Math.random() - 0.5) * 8,
      size: 0.6 + Math.random() * 1.6,
      delay: Math.random() * 0.4,
    }));
    setBubbles((current) => [...current, ...fresh]);
    setTimeout(
      () => setBubbles((current) => current.filter((b) => b.batch !== batch)),
      2200
    );
  };

  const selectTeam = (team, event) => {
    if (team.id === activeId) {
      setActiveId(null); // click again to close
      return;
    }
    setActiveId(team.id);
    releaseBubbles(event.currentTarget);
  };

  const activeTeam = teams.find((t) => t.id === activeId);
  const isLarge = activeTeam?.members.length >= 10;

  return (
    <section
      ref={sectionRef}
      className="@container relative w-full aspect-[2880/2514] overflow-clip bg-[#3967AB]"
    >
     
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none"
        aria-hidden="true"
      >
        <img src={Sea1} alt="" className="absolute left-0 top-0 h-auto w-full max-w-none" />
        <img src={Sea2} alt="" className="absolute left-[66.46%] top-[3.18%] h-auto w-[33.54%] max-w-none" />
        <img src={Sea3} alt="" className="absolute left-[84.38%] top-[68.02%] h-auto w-[15.63%] max-w-none" />
        <img src={Sea4} alt="" className="absolute left-0 bottom-0 h-auto w-full max-w-none" />
      </div>

      
      <div className="absolute inset-0 z-10">

        <h2 className="absolute left-[35.49%] top-[14.72%] w-[27.29%] text-center font-['Crimson_Text'] text-[3.82cqw] font-bold leading-[1.29] text-white [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]">
              Meet The Team
        </h2>
       
        <div className="absolute left-[10.97%] top-[23.63%] flex w-[23.33%] flex-col items-center gap-[0.9cqw]">
          {teams.map((team) => {
            const isActive = team.id === activeId;
            
            return (
              <button
                key={team.id}
                type="button"
                onClick={(event) => selectTeam(team, event)}
                aria-pressed={isActive}
                className={`@container relative transition-all duration-500 ease-out ${
                  isActive ? 'z-10 w-full' : 'w-[73.81%]'
                }`}
              >
                <img
                  src={isActive ? onclickfish : fish }
                  alt=""
                  className={`h-auto w-full select-none ${
                    isActive ? 'animate-[fish-pop_0.5s_ease-out] motion-reduce:animate-none' : ''
                  }`}
                />
                <span
                 className={`absolute left-[22.62%] top-[35.66%] flex h-[31.47%] w-[42.86%] items-center justify-center text-center font-['Crimson_Text'] text-[10cqw] font-bold leading-[1.29] ${
                isActive ? 'text-[#2C488C]' : 'text-white'
                }`}
               >
                   {team.name}
                </span>
              </button>
            );
          })}
        </div>

      
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {bubbles.map((b) => (
            <Fragment key={b.key}>
              {b.ripple && (
                <span
                  className="absolute h-[20cqw] w-[20cqw] animate-[ripple_0.9s_ease-out_forwards] rounded-full border-2 border-white/60 motion-reduce:hidden"
                  style={{ left: b.x, top: b.y }}
                />
              )}
              <span
                className="absolute animate-[bubble-float_1.6s_ease-in-out_forwards] rounded-full border border-white/60 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.9),rgba(255,255,255,0.15)_40%,rgba(255,255,255,0.05))] opacity-0 motion-reduce:hidden"
                style={{
                  left: b.x,
                  top: b.y,
                  marginLeft: `${b.offset}cqw`,
                  width: `${b.size}cqw`,
                  height: `${b.size}cqw`,
                  '--dx': `${b.dx}cqw`,
                  animationDelay: `${b.delay}s`,
                }}
              />
            </Fragment>
          ))}
        </div>

        {activeTeam && (
  <div
    className={`absolute left-[37.22%] top-[26.01%] flex flex-wrap justify-center gap-x-[1.5cqw] gap-y-[1.2cqw] ${
      isLarge ? 'w-[60.5cqw]' : 'w-[52.38cqw]'
    }`}
  >
    {activeTeam.members.map((member, i) => (
      <figure
        key={member.name + i}
        style={{ animationDelay: `${i * 0.08}s` }}
        className={`flex flex-col items-center animate-[photo-pop_0.5s_ease-out_both] motion-reduce:animate-none ${
          isLarge ? 'w-[14cqw]' : 'w-[16.46cqw]'
        }`}
      >
        <div className="relative aspect-[237/224] w-full">
          <img
            src={member.photo}
            alt=""
            className="absolute inset-[8%] h-[84%] w-[84%] object-cover"
          />
          <img
            src={photo}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
          />
        </div>
        <figcaption className="-mt-[0.35cqw] flex min-h-[3.06cqw] w-full items-center justify-center text-center font-['Crimson_Text'] text-[1.39cqw] font-bold leading-[1.3] text-white">
           {member.name}
        </figcaption>
      </figure>
    ))}
  </div>
)}
      </div>
    </section>
  );
}

export default MeetTheTeam;