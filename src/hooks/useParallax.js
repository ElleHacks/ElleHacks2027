import { useRef } from 'react';

// Moving the mouse over the section sets --px / --py (-1 to 1 from the centre).
// Layers then shift by different amounts, e.g. style={{ translate: 'calc(var(--px) * -1cqw) 0' }}.
export function useParallax() {
  const ref = useRef(null);
  const frame = useRef(0);

  const onPointerMove = (event) => {
    if (event.pointerType === 'touch' || frame.current) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const { clientX, clientY } = event;

    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--px', (((clientX - rect.left) / rect.width) * 2 - 1).toFixed(3));
      el.style.setProperty('--py', (((clientY - rect.top) / rect.height) * 2 - 1).toFixed(3));
    });
  };

  const onPointerLeave = () => {
    ref.current?.style.setProperty('--px', '0');
    ref.current?.style.setProperty('--py', '0');
  };

  return { ref, onPointerMove, onPointerLeave };
}

// Shifts a layer with the pointer; bigger `depth` moves more (negative moves the other way).
export const parallax = (depth, vertical = 0) => ({
  translate: `calc(var(--px, 0) * ${depth}cqw) calc(var(--py, 0) * ${vertical}cqw)`,
});
