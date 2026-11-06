import { useEffect, useRef } from "react";

const trailColors = ["#ffffff", "#c4ecfd", "#ffefd8", "#cfc6e9"];

function CursorSparkles() {
  const trailRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;

    const trail = trailRef.current;
    let lastSpawn = 0;
    let idleTimer = 0;

    const clearTrail = () => {
      trail.replaceChildren();
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
      if (event.pointerType === "touch") return;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(clearTrail, 120);
      const now = performance.now();
      if (now - lastSpawn > 36) {
        lastSpawn = now;
        spawnTrail(event.clientX, event.clientY);
      }
    };

    const onLeave = () => {
      window.clearTimeout(idleTimer);
      clearTrail();
    };

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      clearTrail();
    };
  }, []);

  return (
    <div className="cursor-sparkles pointer-events-none fixed inset-0 z-[200]" aria-hidden="true">
      <div ref={trailRef} className="absolute inset-0" />
    </div>
  );
}

export default CursorSparkles;
