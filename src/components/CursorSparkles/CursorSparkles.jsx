import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const trailColors = ["#ffffff", "#c4ecfd", "#ffefd8", "#cfc6e9"];
const FISH_ZONE_START_ID = "meettheteam";

function CursorSparkles() {
  const trailRef = useRef(null);
  const sparklesRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return undefined;

    const trail = trailRef.current;
    const sparkles = sparklesRef.current;
    if (!trail || !sparkles) return undefined;

    let lastSpawn = 0;
    let idleTimer = 0;
    let pointerY = null;

    const isFishVisible = (clientY) => {
      const start = document.getElementById(FISH_ZONE_START_ID);
      if (!start) return false;
      return start.getBoundingClientRect().top <= clientY;
    };

    const clearTrail = () => {
      trail.replaceChildren();
    };

    const hideSparkles = () => {
      window.clearTimeout(idleTimer);
      clearTrail();
      sparkles.style.visibility = "hidden";
    };

    const showSparkles = () => {
      sparkles.style.visibility = "visible";
    };

    const spawnTrail = (clientX, clientY) => {
      const node = document.createElement("span");
      const size = 4 + Math.random() * 7;
      node.className = "cursor-sparkle-trail";
      node.style.left = `${clientX}px`;
      node.style.top = `${clientY}px`;
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
      node.style.marginLeft = `${-size / 2}px`;
      node.style.marginTop = `${-size / 2}px`;
      node.style.color = trailColors[Math.floor(Math.random() * trailColors.length)];
      node.style.setProperty("--drift-x", `${(Math.random() - 0.5) * 28}px`);
      node.style.setProperty("--drift-y", `${-6 - Math.random() * 20}px`);
      trail.appendChild(node);
      node.addEventListener("animationend", () => node.remove(), { once: true });
      if (trail.childElementCount > 36) trail.firstElementChild?.remove();
    };

    const onMove = (event) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      pointerY = event.clientY;
      if (isFishVisible(pointerY)) {
        hideSparkles();
        return;
      }

      showSparkles();
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(clearTrail, 120);
      const now = performance.now();
      if (now - lastSpawn > 36) {
        lastSpawn = now;
        spawnTrail(event.clientX, event.clientY);
      }
    };

    const onScroll = () => {
      if (pointerY === null) return;
      if (isFishVisible(pointerY)) hideSparkles();
      else showSparkles();
    };

    const onLeave = () => {
      pointerY = null;
      hideSparkles();
    };

    // Start visible so a stuck "hidden" from HMR/prior scroll doesn't linger.
    showSparkles();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      clearTrail();
    };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={sparklesRef}
      className="cursor-sparkles pointer-events-none fixed inset-0 z-[200]"
      aria-hidden="true"
    >
      <div ref={trailRef} className="absolute inset-0 overflow-visible" />
    </div>,
    document.body
  );
}

export default CursorSparkles;
