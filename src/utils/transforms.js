/**
 * Generate an array of n random CSS transform strings for card positioning.
 */
export function generateBaseTransforms(n) {
  return Array.from({ length: n }, () => {
    const x = Math.random() * 4 - 2;
    const y = Math.random() * 4 - 2;
    const r = Math.random() * 4 - 2;
    return `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${r}deg)`;
  });
}

/**
 * Generate a random offset/rotation object for hover effects.
 */
export function randomTransform({ maxOffset = 10, maxRotation = 10 } = {}) {
  return {
    offsetX: Math.random() * maxOffset * 2 - maxOffset,
    offsetY: Math.random() * maxOffset * 2 - maxOffset,
    rotation: Math.random() * maxRotation * 2 - maxRotation,
  };
}

/**
 * Build a random drawn-card inline style (position + rotation).
 */
export function drawnCardStyle() {
  const tx = Math.random() * 40 - 20;
  const ty = Math.random() * 40 - 20;
  const rot = Math.random() * 40 - 20;
  return {
    transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotate(${rot}deg)`,
  };
}
