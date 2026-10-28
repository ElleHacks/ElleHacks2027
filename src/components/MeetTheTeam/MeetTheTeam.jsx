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
      3200
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

        <h2 className="absolute left-[37.22%] top-[15.59%] flex h-[5.76cqw] w-[29.86cqw] items-center justify-start whitespace-nowrap text-left font-['Poppins'] text-[3.82cqw] font-bold leading-[1.49] text-[#FFEFD8] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]">
              Meet The Team
        </h2>
       
        <div className="absolute left-[11%] top-[23.5%] flex w-[23.33cqw] flex-col items-center gap-[0.56cqw]">
          {teams.map((team) => {
            const isActive = team.id === activeId;
            
            return (
              <button
                key={team.id}
                type="button"
                onClick={(event) => selectTeam(team, event)}
                aria-pressed={isActive}
                className={`@container group relative transition-[filter,width] duration-300 ease-out hover:brightness-110 active:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  isActive
                ? 'z-10 w-full'
                : 'w-[73.81%]'
                }`}
              >
                <img
                  src={isActive ? onclickfish : fish }
                  alt=""
                  className={`h-auto w-full select-none transition-transform duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] group-hover:scale-[1.03] group-active:scale-[0.97] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-active:scale-100 ${
                    isActive
                      ? 'animate-[fish-pop_0.5s_ease-out] drop-shadow-[0_0_0.8cqw_rgba(255,239,216,0.65)] motion-reduce:animate-none'
                      : ''
                  }`}
                />
                <span
                 className={`absolute left-[22.62%] top-[35.66%] flex h-[31.47%] w-[42.86%] items-center justify-center text-balance text-center font-['Poppins'] font-bold leading-[1.05] transition-transform duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] group-hover:scale-105 group-active:scale-95 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-active:scale-100 ${
                isActive
                  ? 'text-[8cqw] text-[#2C488C]'
                  : 'text-[8cqw] text-white'
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
                className="absolute animate-[bubble-float_2.6s_linear_forwards] rounded-full border border-white/60 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.9),rgba(255,255,255,0.15)_40%,rgba(255,255,255,0.05))] opacity-0 motion-reduce:hidden"
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
            className={`absolute top-[26.01%] grid justify-items-center ${
              activeTeam.id === 'team5'
                ? 'left-[35.5%] w-[62cqw] grid-cols-4 gap-x-[1.6cqw] gap-y-[1.6cqw]'
                : 'left-[37.22%] w-[52.02cqw] grid-cols-3 gap-x-[1.11cqw] gap-y-[1.2cqw]'
            }`}
          >
    {activeTeam.members.map((member, i) => (
      <figure
        key={member.name + i}
        style={{
          animationDelay: `${i * 0.08}s`,
          ...(activeTeam.id === 'team5' && i >= activeTeam.members.length - 2
            ? { gridColumnStart: i === activeTeam.members.length - 2 ? 2 : 3 }
            : {}),
        }}
        className={`flex flex-col items-center animate-[photo-pop_0.5s_ease-out_both] motion-reduce:animate-none ${
          activeTeam.id === 'team5' ? 'w-[14cqw]' : 'w-[16.46cqw]'
        }`}
      >
        <div className="relative aspect-[237/224] w-full transition-transform duration-300 hover:-translate-y-[0.4cqw] hover:scale-[1.03] motion-reduce:hover:transform-none">
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
        <figcaption className="-mt-[0.35cqw] flex min-h-[3.41cqw] w-full items-center justify-center text-center font-['Poppins'] text-[1.39cqw] font-bold leading-[1.3] text-white">
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