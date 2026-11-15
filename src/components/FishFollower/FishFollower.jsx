import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// In Meet the Team and Contact Us, small bubbles trail the pointer like sparkles.
// Mouse/pen only; off for reduced motion.
const ZONE_START_ID = "meettheteam";
const ZONE_END_ID = "contactus";
const SPAWN_MS = 36;
const IDLE_MS = 120;

function FishFollower() {
  const trailRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return undefined;

    const trail = trailRef.current;
    if (!trail) return undefined;

    let lastSpawn = 0;
    let idleTimer = 0;
    let pointerY = null;

    const zoneBottom = () => {
      const end = document.getElementById(ZONE_END_ID);
      if (!end) return null;
      // Anchor div sits above the section; use the section itself when present.
      const block = end.nextElementSibling ?? end;
      return block.getBoundingClientRect().bottom;
    };

    const inZone = (clientY) => {
      const start = document.getElementById(ZONE_START_ID);
      if (!start) return false;
      const top = start.getBoundingClientRect().top;
      const bottom = zoneBottom();
      if (bottom == null) return false;
      return clientY >= top && clientY <= bottom;
    };

    const clearTrail = () => {
      window.clearTimeout(idleTimer);
      trail.replaceChildren();
    };

    const spawn = (clientX, clientY) => {
      const node = document.createElement("span");
      const size = 4 + Math.random() * 7;
      node.className = "cursor-bubble-trail";
      node.style.left = `${clientX}px`;
      node.style.top = `${clientY}px`;
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
      node.style.marginLeft = `${-size / 2}px`;
      node.style.marginTop = `${-size / 2}px`;
      node.style.setProperty("--drift-x", `${(Math.random() - 0.5) * 28}px`);
      node.style.setProperty("--drift-y", `${-6 - Math.random() * 20}px`);
      trail.appendChild(node);
      node.addEventListener("animationend", () => node.remove(), { once: true });
      if (trail.childElementCount > 36) trail.firstElementChild?.remove();
    };

    const onMove = (event) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      pointerY = event.clientY;
      if (!inZone(pointerY)) {
        clearTrail();
        return;
      }

      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(clearTrail, IDLE_MS);
      const now = performance.now();
      if (now - lastSpawn > SPAWN_MS) {
        lastSpawn = now;
        spawn(event.clientX, event.clientY);
      }
    };

    const onScroll = () => {
      if (pointerY !== null && !inZone(pointerY)) clearTrail();
    };

    const onLeave = () => {
      pointerY = null;
      clearTrail();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      trail.replaceChildren();
    };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={trailRef}
      className="pointer-events-none fixed inset-0 z-[198] overflow-visible"
      aria-hidden="true"
    />,
    document.body
  );
}

export default FishFollower;
