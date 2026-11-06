import { useEffect, useRef } from "react";

// Clicking anywhere sends a ripple and a few bubbles out from the pointer.
// Built with plain DOM nodes (like CursorSparkles) so clicks never re-render React.
function ClickSplash() {
  const layerRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = layerRef.current;

    const spawn = (className, x, y, styles) => {
      const node = document.createElement("span");
      node.className = className;
      // setProperty also handles custom properties like --dx, which plain assignment ignores.
      Object.entries({ left: `${x}px`, top: `${y}px`, ...styles }).forEach(([key, value]) =>
        node.style.setProperty(key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`), value)
      );
      layer.appendChild(node);
      node.addEventListener("animationend", () => node.remove(), { once: true });
    };

    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      const { clientX: x, clientY: y } = event;
      spawn("click-ripple", x, y, {});
      for (let i = 0; i < 4; i++) {
        const size = 4 + Math.random() * 6;
        spawn("click-bubble", x, y, {
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${i * 0.06}s`,
          "--dx": `${(Math.random() - 0.5) * 50}px`,
        });
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      layer.replaceChildren();
    };
  }, []);

  return <div ref={layerRef} className="pointer-events-none fixed inset-0 z-[199]" aria-hidden="true" />;
}

export default ClickSplash;
