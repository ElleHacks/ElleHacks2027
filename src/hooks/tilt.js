// Tilts an element toward the pointer in 3D. Uses the `rotate` property (not `transform`),
// so it stacks with entrance and hover animations instead of fighting them.
// Spread the result onto the element, and give its parent some perspective.
const MAX_TILT = 10; // degrees

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const tiltHandlers = {
  onPointerMove(event) {
    if (event.pointerType === 'touch' || reducedMotion()) return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    const angle = Math.min(1, Math.hypot(x, y)) * MAX_TILT;
    // Spin around the axis at right angles to the pointer, so that corner dips away.
    el.style.rotate = `${-y.toFixed(3)} ${x.toFixed(3)} 0 ${angle.toFixed(2)}deg`;
  },
  onPointerLeave(event) {
    event.currentTarget.style.rotate = '';
  },
};
