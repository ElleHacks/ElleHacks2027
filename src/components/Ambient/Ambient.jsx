// Background particles: snow over the ice, bubbles under the water.
// Positions come from a seeded random so they stay the same on every render.

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function makeParticles(count, seed) {
  const rand = seeded(seed);
  return Array.from({ length: count }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: rand(),
    duration: rand(),
    delay: rand(),
    drift: rand() - 0.5,
  }));
}

const flakes = makeParticles(45, 7);
const bubbles = makeParticles(18, 42);
const stars = makeParticles(4, 99);
const rays = makeParticles(5, 13);
const school = makeParticles(6, 5);

// A few shooting stars, each streaking past now and then.
export function ShootingStars({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden ${className}`} aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute h-[2px] w-[9cqw] origin-left animate-[shooting-star_linear_infinite] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9))] opacity-0 shadow-[0_0_6px_rgba(255,255,255,0.8)]"
          style={{
            left: `${20 + s.left * 70}%`,
            top: `${3 + s.top * 22}%`,
            rotate: `${150 + s.drift * 20}deg`,
            animationDuration: `${9 + s.duration * 9}s`,
            animationDelay: `${2 + i * 3.5 + s.delay * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

// Sunbeams slanting down through the water.
export function LightRays({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden mix-blend-soft-light motion-reduce:hidden ${className}`} aria-hidden="true">
      {rays.map((r, i) => (
        <span
          key={i}
          className="absolute -top-[5%] h-[75%] origin-top animate-[light-ray_ease-in-out_infinite] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0))] blur-[1.2cqw]"
          style={{
            left: `${5 + i * 19 + r.left * 8}%`,
            width: `${3 + r.size * 5}cqw`,
            "--skew": `${-18 + r.drift * 10}deg`,
            animationDuration: `${7 + r.duration * 6}s`,
            animationDelay: `${-r.delay * 10}s`,
          }}
        />
      ))}
    </div>
  );
}

// A small school of fish crossing right to left; `top` places it in the section.
export function FishSchool({ src, top = "30%", duration = 38, delay = 0, className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute left-full w-[18cqw] animate-[school-swim_linear_infinite] motion-reduce:hidden ${className}`}
      style={{ top, animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      {school.map((f, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="absolute h-auto max-w-none animate-[fin-wiggle_ease-in-out_infinite] select-none"
          style={{
            left: `${(i % 3) * 30 + f.left * 15}%`,
            top: `${Math.floor(i / 3) * 3.5 + f.top * 2}cqw`,
            width: `${3 + f.size * 2}cqw`,
            rotate: "25deg",
            animationDuration: `${0.8 + f.duration * 0.6}s`,
            animationDelay: `${-f.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// `fall` is how far the flakes travel, in cqw (about the section's height).
export function Snow({ fall = 75, className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden ${className}`} aria-hidden="true">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="absolute -top-[2%] animate-[snow-fall_linear_infinite] rounded-full bg-white/80"
          style={{
            left: `${f.left}%`,
            width: `${0.2 + f.size * 0.45}cqw`,
            height: `${0.2 + f.size * 0.45}cqw`,
            opacity: 0.4 + f.size * 0.5,
            "--fall": `${fall}cqw`,
            "--drift": `${f.drift * 8}cqw`,
            animationDuration: `${10 + f.duration * 12}s`,
            animationDelay: `${-f.delay * 22}s`,
          }}
        />
      ))}
    </div>
  );
}

// Bubbles rise from the bottom; `rise` is how far they float up, in cqw.
export function Bubbles({ rise = 50, count = bubbles.length, className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden ${className}`} aria-hidden="true">
      {bubbles.slice(0, count).map((b, i) => (
        <span
          key={i}
          className="absolute bottom-0 animate-[bubble-float_ease-in_infinite] rounded-full border border-white/50 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.85),rgba(255,255,255,0.12)_45%,rgba(255,255,255,0.04))] opacity-0"
          style={{
            left: `${b.left}%`,
            width: `${0.5 + b.size * 1.4}cqw`,
            height: `${0.5 + b.size * 1.4}cqw`,
            "--rise": `${rise * (0.6 + b.top * 0.4)}cqw`,
            "--dx": `${b.drift * 6}cqw`,
            animationDuration: `${7 + b.duration * 8}s`,
            animationDelay: `${-b.delay * 15}s`,
          }}
        />
      ))}
    </div>
  );
}
