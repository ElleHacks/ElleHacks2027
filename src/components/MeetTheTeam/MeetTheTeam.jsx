import { Fragment, useRef, useState } from 'react';
import { teams } from './teamsData';
import Reveal from '../Reveal/Reveal';
import { Jellyfish, SwimmingFish, Turtle} from '../SeaLife/SeaLife';
import locationFish from '../../assets/Location/fish.png';
import { bloop } from '../../audio/seaSound';
import { tiltHandlers } from '../../hooks/tilt';

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
  const nextBatch = useRef(0);

  const releaseBubbles = (button) => {
    const section = sectionRef.current.getBoundingClientRect();
    const rect = button.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2 - section.left) / section.width) * 100;
    const y = ((rect.top + rect.height / 2 - section.top) / section.height) * 100;

    const batch = nextBatch.current++;
    const fresh = Array.from({ length: 14 }, (_, i) => ({
      key: `${batch}-${i}`,
      batch,
      ripple: i === 0,
      x: `${x}%`,
      y: `${y}%`,
      rise: y * 0.873 + Math.random() * 4, // cqw needed to reach the top of the section
      offset: (Math.random() - 0.5) * 12,
      dx: (Math.random() - 0.5) * 8,
      size: 0.6 + Math.random() * 1.6,
      delay: Math.random() * 0.6,
    }));
    setBubbles((current) => [...current, ...fresh]);
    setTimeout(
      () => setBubbles((current) => current.filter((b) => b.batch !== batch)),
      4500
    );
  };

  const selectTeam = (team, event) => {
    if (team.id === activeId) {
      setActiveId(null); // click again to close
      return;
    }
    setActiveId(team.id);
    releaseBubbles(event.currentTarget);
    bloop();
  };

  const activeTeam = teams.find((t) => t.id === activeId);
  const hasExpandedTeam = (activeTeam?.members.length ?? 0) > 9;
  const memberRows = Math.ceil((activeTeam?.members.length ?? 0) / 3);
  const memberGridHeight =
    memberRows * (16.46 * (224 / 237) + 3.41 - 0.35) +
    (memberRows - 1) * 1.2 +
    8;
  const expandedTeamAspectRatio = hasExpandedTeam
    ? 100 / (memberGridHeight / (1 - 0.2601))
    : undefined;

  return (
    <section
      ref={sectionRef}
      style={
        hasExpandedTeam
          ? { '--expanded-team-aspect': expandedTeamAspectRatio }
          : undefined
      }
      className={`@container relative min-h-[60rem] w-full overflow-clip bg-[#3967AB] md:min-h-0 ${
        hasExpandedTeam
          ? 'md:aspect-[var(--expanded-team-aspect)] md:z-20'
          : 'md:aspect-[2880/2514]'
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none"
        aria-hidden="true"
      >
        <img src={Sea1} alt="" className="absolute left-0 top-0 hidden h-[65.56vw] w-full max-w-none object-fill md:block md:h-auto" />
        <img src={Sea2} alt="" className="absolute left-[66.46%] top-[3.18%] h-auto w-[33.54%] max-w-none" />
        <img src={Sea3} alt="" className="absolute left-[84.38%] top-[68.02%] h-auto w-[15.63%] max-w-none" />
        <img src={Sea4} alt="" className="absolute left-0 bottom-0 h-auto w-full max-w-none" />
        <Turtle top="1%" duration={50} delay={-12} />
        <Jellyfish left="4.5%" top="60%" size={4} delay={-3} />
        <SwimmingFish src={locationFish} faces="right" top="90%" width={4} duration={28} delay={-4} tilt={20} />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 py-10 md:absolute md:inset-0 md:block md:px-0 md:py-0">

        <Reveal as="h2" className="relative mb-6 flex items-center justify-center text-center font-['Poppins'] text-3xl font-bold leading-[1.2] text-[#FFEFD8] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)] md:absolute md:left-[37.22%] md:top-[15.59%] md:mb-0 md:h-[5.76cqw] md:w-[29.86cqw] md:justify-start md:whitespace-nowrap md:text-left md:text-[3.82cqw] md:leading-[1.49]">
          Meet The Team
        </Reveal>

        <div className="relative grid w-full grid-cols-2 items-center justify-items-center gap-3 md:absolute md:left-[11%] md:top-[23.5%] md:flex md:w-[23.33cqw] md:flex-col md:gap-[0.56cqw]">
          {teams.map((team, i) => {
            const isActive = team.id === activeId;
            const bubbleAnim = isActive
              ? 'animate-[sub-bubble_1.8s_ease-out_infinite]'
              : 'group-hover:animate-[sub-bubble_1.8s_ease-out_infinite]';

            return (
              <button
                key={team.id}
                type="button"
                onClick={(event) => selectTeam(team, event)}
                aria-pressed={isActive}
                style={{ animationDelay: `${i * 0.4}s` }}
                className={`@container group relative transition-[filter,width] duration-300 ease-out hover:brightness-110 active:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:animate-none ${
                  isActive
                    ? 'z-10 w-full md:w-full'
                    : 'w-full animate-[sub-bob_6s_ease-in-out_infinite] md:w-[73.81%]'
                }`}
              >
                <img
                  src={isActive ? onclickfish : fish}
                  alt=""
                  className={`h-auto w-full select-none transition-transform duration-300 ease-out group-hover:scale-[1.03] group-active:scale-[0.97] motion-reduce:transition-none ${
                    isActive
                      ? 'animate-[fish-pop_0.5s_ease-out] drop-shadow-[0_0_0.8cqw_rgba(255,239,216,0.65)] motion-reduce:animate-none'
                      : ''
                  }`}
                />

                {/* bubble trail from the back (right side) of the sub */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-[6%] top-[45%] motion-reduce:hidden"
                >
                  {[0, 0.45, 0.9, 1.35].map((d, n) => (
                    <span
                      key={n}
                      style={{
                        animationDelay: `${d}s`,
                        right: `${n * 3}cqw`,
                        width: `${5 - n * 0.8}cqw`,
                        height: `${5 - n * 0.8}cqw`,
                      }}
                      className={`absolute rounded-full border border-white/70 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.9),rgba(255,255,255,0.1)_60%)] opacity-0 ${bubbleAnim}`}
                    />
                  ))}
                </span>

                <span
                  className={`absolute left-[22.62%] top-[35.66%] flex h-[31.47%] w-[42.86%] items-center justify-center text-balance text-center font-['Poppins'] font-bold leading-[1.05] text-[8cqw] ${
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
                className="absolute animate-[bubble-float_3.5s_ease-in_forwards] rounded-full border border-white/60 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.9),rgba(255,255,255,0.15)_40%,rgba(255,255,255,0.05))] opacity-0 motion-reduce:hidden"
                style={{
                  left: b.x,
                  top: b.y,
                  marginLeft: `${b.offset}cqw`,
                  width: `${b.size}cqw`,
                  height: `${b.size}cqw`,
                  '--dx': `${b.dx}cqw`,
                  '--rise': `${b.rise}cqw`,
                  animationDelay: `${b.delay}s`,
                }}
              />
            </Fragment>
          ))}
        </div>

        {activeTeam && (
          <div
            className={`relative mt-6 grid w-full grid-cols-2 justify-items-center gap-4 md:absolute md:top-[26.01%] md:mt-0 md:left-[37.22%] md:w-[52.02cqw] md:grid-cols-3 md:gap-x-[1.11cqw] md:gap-y-[1.2cqw]`} //${
            //   activeTeam.id === 'team5'
            //     ? 'md:left-[35.5%] md:w-[62cqw] md:grid-cols-4 md:gap-x-[1.6cqw] md:gap-y-[1.6cqw]'
            //     : 'md:left-[37.22%] md:w-[52.02cqw] md:grid-cols-3 md:gap-x-[1.11cqw] md:gap-y-[1.2cqw]'
            // }`}
          >
            {activeTeam.members.map((member, i) => (
              <figure
                key={member.name + i}
                style={{
                  animationDelay: `${i * 0.08}s`,
                  ...( //activeTeam.id === 'team5' && i >= activeTeam.members.length - 2
                    // ? { gridColumnStart: i === activeTeam.members.length - 2 ? 2 : 3 }
                    // : 
                    {}),
                }}
                className={`flex w-full max-w-36 flex-col items-center [perspective:40cqw] animate-[photo-pop_0.5s_ease-out_both] motion-reduce:animate-none md:max-w-none md:w-[16.46cqw]`
                //   ${
                //   activeTeam.id === 'team5' ? 'md:w-[14cqw]' : 'md:w-[16.46cqw]'
                // }`
                }
              >
                <div
                  {...tiltHandlers}
                  className="relative aspect-[237/224] w-full transition-transform duration-300 hover:-translate-y-[0.4cqw] hover:scale-[1.03] motion-reduce:hover:transform-none">
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
                <figcaption className="-mt-[0.35cqw] flex min-h-10 w-full items-center justify-center text-center font-['Poppins'] text-xs font-bold leading-[1.3] text-white md:min-h-[3.41cqw] md:text-[1.39cqw]">
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