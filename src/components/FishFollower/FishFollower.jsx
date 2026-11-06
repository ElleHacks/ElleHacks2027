import { useEffect, useRef } from "react";
import fish from "../../assets/Location/fish.png";

// Once the pointer is below the Location section (Meet The Team and onward),
// a fish swims after it: it eases toward the cursor, turns to face the way it's
// going, and tips up or down with its movement. Mouse only; off for reduced motion.
const ZONE_START_ID = "meettheteam";
const FOLLOW = 0.08; // how much of the gap to close each frame
const SIZE = 120;

function FishFollower() {
  const fishRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return;

    const el = fishRef.current;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let facing = 1;
    let tilt = 0;
    let active = false;
    let frame = 0;

    const inZone = (clientY) => {
      const start = document.getElementById(ZONE_START_ID);
      return Boolean(start) && start.getBoundingClientRect().top <= clientY;
    };

    const tick = () => {
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      pos.x += dx * FOLLOW;
      pos.y += dy * FOLLOW;

      // Only turn around on a clear sideways move, so it doesn't flicker back and forth.
      if (Math.abs(dx) > 4) facing = dx > 0 ? 1 : -1;
      const wanted = Math.max(-35, Math.min(35, (Math.atan2(dy, Math.abs(dx) + 20) * 180) / Math.PI));
      tilt += (wanted * facing - tilt) * 0.15;

      // The image points up-right, so rotate(20deg) levels it before flipping and tilting.
      el.style.transform = `translate(${pos.x - SIZE / 2}px, ${pos.y - SIZE / 2}px) rotate(${tilt}deg) scaleX(${facing}) rotate(20deg)`;

      const settled = Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5;
      frame = active || !settled ? requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const show = (visible) => {
      if (visible === active) return;
      active = visible;
      el.style.opacity = visible ? "1" : "0";
    };

    const onMove = (event) => {
      if (event.pointerType === "touch") return;
      target.x = event.clientX;
      target.y = event.clientY;
      const entering = !active && inZone(event.clientY);
      if (entering) {
        // Swim in from just behind the cursor rather than from wherever it last was.
        pos.x = target.x - 60 * facing;
        pos.y = target.y;
      }
      show(inZone(event.clientY));
      start();
    };

    // Scrolling moves the page under a still cursor, so re-check the zone.
    const onScroll = () => show(inZone(target.y));
    const onLeave = () => show(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <img
      ref={fishRef}
      src={fish}
      alt=""
      aria-hidden="true"
      width={SIZE}
      className="pointer-events-none fixed top-0 left-0 z-[198] h-auto opacity-0 drop-shadow-[0_4px_6px_rgba(5,10,30,0.35)] transition-opacity duration-300 select-none"
    />
  );
}

export default FishFollower;
