// Background particles: snow over the ice, and fish schools.
// Positions come from a seeded random so they stay the same on every render.
import { useEffect, useRef, useState } from "react";

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
const school = makeParticles(6, 5);

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
export function Snow({ className = "" }) {
  const layerRef = useRef(null);
  const [layerHeight, setLayerHeight] = useState(0);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const updateHeight = () => setLayerHeight(layer.clientHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(layer);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={layerRef} className={`pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden ${className}`} aria-hidden="true">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="absolute -top-[2%] animate-[snow-fall_linear_infinite] rounded-full bg-white/80"
          style={{
            left: `${f.left}%`,
            width: `${0.2 + f.size * 0.45}cqw`,
            height: `${0.2 + f.size * 0.45}cqw`,
            opacity: 0.4 + f.size * 0.5,
            "--fall": `${layerHeight * 1.02}px`,
            "--drift": `${f.drift * 8}cqw`,
            animationDuration: `${10 + f.duration * 12}s`,
            animationDelay: `${-f.delay * 22}s`,
          }}
        />
      ))}
    </div>
  );
}
