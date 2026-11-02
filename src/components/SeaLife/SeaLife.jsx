import { useId } from "react";

// Sea creatures drawn as SVG in soft colours to sit with the watercolour art.
// Each one is decorative: positioned by the section, hidden from screen readers,
// and switched off for people who prefer reduced motion.

// SVG parts animate around a point in the drawing's own units.
const pivot = (x, y) => ({ transformBox: "view-box", transformOrigin: `${x}px ${y}px` });

const motionOff = "motion-reduce:hidden";

// A fish image crossing the section. `faces` is which way the picture points;
// `tilt` levels out a fish that's drawn at an angle.
export function SwimmingFish({ src, faces = "left", top, width = 6, duration = 30, delay = 0, tilt = 0, opacity = 1, className = "" }) {
  const goingRight = faces === "right";
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${goingRight ? "right-full animate-[swim-right_linear_infinite]" : "left-full animate-[school-swim_linear_infinite]"} ${motionOff} ${className}`}
      style={{ top, width: `${width}cqw`, animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
    >
      <img
        src={src}
        alt=""
        className="h-auto w-full max-w-none animate-[swim-bob_2.4s_ease-in-out_infinite] select-none"
        style={{ rotate: `${tilt}deg`, opacity }}
      />
    </div>
  );
}

export function Jellyfish({ left, top, size = 6, hue = "pink", delay = 0, className = "" }) {
  const id = useId();
  const [glow, edge] =
    hue === "blue" ? ["rgba(170,225,255,0.85)", "rgba(120,170,255,0.25)"] : ["rgba(255,200,235,0.85)", "rgba(190,150,255,0.25)"];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute animate-[jelly-drift_9s_ease-in-out_infinite] ${motionOff} ${className}`}
      style={{ left, top, width: `${size}cqw`, animationDelay: `${delay}s` }}
    >
      <svg viewBox="0 0 60 110" className="h-auto w-full overflow-visible drop-shadow-[0_0_0.8cqw_rgba(255,220,250,0.55)]">
        <defs>
          <radialGradient id={`${id}-bell`} cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor={glow} />
            <stop offset="100%" stopColor={edge} />
          </radialGradient>
        </defs>
        <g className="animate-[tentacle-wave_3s_ease-in-out_infinite]" style={{ ...pivot(30, 34), animationDelay: `${delay}s` }}>
          {[14, 23, 37, 46].map((x, i) => (
            <path
              key={x}
              d={`M${x} 34 C ${x - 6} 52, ${x + 6} 66, ${x - 2} 82 S ${x + 4} 98, ${x - 1} ${100 + (i % 2) * 6}`}
              fill="none"
              stroke={glow}
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.7"
            />
          ))}
          <path d="M26 34 C 22 50, 32 58, 27 74 M34 34 C 38 50, 28 60, 33 72" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g className="animate-[jelly-pulse_1.8s_ease-in-out_infinite]" style={{ ...pivot(30, 6), animationDelay: `${delay}s` }}>
          <path
            d="M4 34 C 4 8, 56 8, 56 34 C 50 31, 46 37, 40 34 C 35 31, 30 37, 25 34 C 20 31, 15 37, 10 34 C 8 33, 6 33, 4 34 Z"
            fill={`url(#${id}-bell)`}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1"
          />
          <ellipse cx="22" cy="18" rx="7" ry="4" fill="rgba(255,255,255,0.45)" />
        </g>
      </svg>
    </div>
  );
}

// A sea turtle paddling left to right across the section.
export function Turtle({ top, size = 12, duration = 46, delay = 0, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute right-full animate-[swim-right_linear_infinite] ${motionOff} ${className}`}
      style={{ top, width: `${size}cqw`, animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
    >
      <svg viewBox="0 0 120 72" className="h-auto w-full animate-[swim-bob_4s_ease-in-out_infinite] overflow-visible">
        {/* far flippers, in shadow */}
        <path className="animate-[flipper_2.6s_ease-in-out_infinite]" style={{ ...pivot(72, 38), animationDelay: "-1.3s" }}
          d="M72 38 C 66 26, 52 16, 38 14 C 50 22, 58 30, 66 40 Z" fill="#6f8f73" />
        <path className="animate-[flipper_2.6s_ease-in-out_infinite]" style={{ ...pivot(28, 42), animationDelay: "-1.3s" }}
          d="M28 42 C 20 36, 10 34, 4 36 C 10 40, 18 44, 26 46 Z" fill="#6f8f73" />
        {/* head and neck */}
        <path d="M86 40 C 94 34, 104 30, 112 33 C 118 36, 117 44, 110 46 C 102 48, 94 46, 86 46 Z" fill="#a9c79b" />
        <circle cx="108" cy="37" r="1.8" fill="#26343d" />
        {/* shell */}
        <path d="M18 44 C 22 16, 84 8, 94 42 C 76 50, 34 52, 18 44 Z" fill="#6c9a72" />
        <path d="M18 44 C 34 52, 76 50, 94 42 C 90 50, 74 56, 56 56 C 38 56, 24 52, 18 44 Z" fill="#d8dfb0" />
        <g fill="#8dbd8a" stroke="#567f5c" strokeWidth="1">
          <ellipse cx="56" cy="26" rx="10" ry="7" />
          <ellipse cx="38" cy="32" rx="8" ry="6" />
          <ellipse cx="74" cy="32" rx="8" ry="6" />
          <ellipse cx="56" cy="40" rx="9" ry="5" />
        </g>
        {/* near flippers */}
        <path className="animate-[flipper_2.6s_ease-in-out_infinite]" style={pivot(74, 46)}
          d="M74 46 C 68 58, 54 68, 36 70 C 50 62, 60 54, 66 44 Z" fill="#a9c79b" />
        <path className="animate-[flipper_2.6s_ease-in-out_infinite]" style={pivot(26, 48)}
          d="M26 48 C 18 52, 8 56, 2 54 C 8 50, 16 46, 24 44 Z" fill="#a9c79b" />
      </svg>
    </div>
  );
}

// A faint whale far off in the deep, gliding slowly left to right.
export function Whale({ top, size = 30, duration = 80, delay = 0, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute right-full animate-[swim-right_linear_infinite] ${motionOff} ${className}`}
      style={{ top, width: `${size}cqw`, animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
    >
      <svg viewBox="0 0 200 80" className="h-auto w-full animate-[swim-bob_7s_ease-in-out_infinite] overflow-visible blur-[1px]" fill="rgba(18,32,78,0.35)">
        <path className="animate-[fluke_3.5s_ease-in-out_infinite]" style={pivot(30, 44)}
          d="M30 44 C 22 40, 14 30, 4 26 C 8 36, 10 42, 16 46 C 10 50, 8 56, 4 64 C 14 60, 22 50, 30 46 Z" />
        <path d="M28 44 C 50 22, 120 14, 170 30 C 188 36, 196 46, 188 54 C 170 66, 100 70, 60 60 C 46 56, 36 50, 28 46 Z" />
        <path className="animate-[flipper_3.5s_ease-in-out_infinite]" style={pivot(130, 58)}
          d="M130 58 C 124 66, 112 74, 100 76 C 110 68, 118 62, 122 56 Z" />
      </svg>
    </div>
  );
}

// A little crab that scuttles sideways along the seabed and snaps its claws.
export function Crab({ left, bottom, size = 5, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute animate-[crab-scuttle_9s_ease-in-out_infinite] ${motionOff} ${className}`}
      style={{ left, bottom, width: `${size}cqw` }}
    >
      <svg viewBox="0 0 80 50" className="h-auto w-full overflow-visible">
        <g stroke="#b84a35" strokeWidth="2.5" strokeLinecap="round" fill="none" className="animate-[swim-bob_0.5s_ease-in-out_infinite]">
          <path d="M26 34 L14 42 M28 37 L18 47 M32 39 L26 49 M54 34 L66 42 M52 37 L62 47 M48 39 L54 49" />
        </g>
        <path d="M32 22 L30 12 M48 22 L50 12" stroke="#b84a35" strokeWidth="2" />
        <circle cx="30" cy="11" r="2.6" fill="#1f2a33" />
        <circle cx="50" cy="11" r="2.6" fill="#1f2a33" />
        {/* Left claw, then the same claw mirrored for the right side. */}
        {[0, 1].map((side) => (
          <g key={side} transform={side ? "translate(80 0) scale(-1 1)" : undefined}>
            <g className="animate-[claw-snap_1.6s_ease-in-out_infinite]" style={{ ...pivot(24, 28), animationDelay: `${side * -0.8}s` }}>
              <path d="M24 28 L14 20" stroke="#d9603f" strokeWidth="4" strokeLinecap="round" />
              <path d="M14 20 C 4 18, 4 8, 12 8 C 10 12, 12 14, 16 14 C 18 10, 22 12, 20 16 C 20 20, 18 22, 14 20 Z" fill="#e8704d" />
            </g>
          </g>
        ))}
        <ellipse cx="40" cy="30" rx="19" ry="12" fill="#e2674a" />
        <ellipse cx="35" cy="25" rx="7" ry="3.5" fill="rgba(255,255,255,0.25)" />
      </svg>
    </div>
  );
}
