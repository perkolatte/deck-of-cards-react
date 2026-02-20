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
  return {
    transform: nudgeTransform("translate(-50%, -50%)", {
      maxOffset: 20,
      maxRotation: 20,
    }),
  };
}

/**
 * Append a random offset/rotation to a base transform string and return the result.
 */
export function nudgeTransform(base, { maxOffset = 5, maxRotation = 10 } = {}) {
  const { offsetX, offsetY, rotation } = randomTransform({
    maxOffset,
    maxRotation,
  });
  return `${base} translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
}

/**
 * Apply a random nudge to an element's inline transform (for drawn cards).
 * Reads the current transform from either data-base-transform, inline style, or a default.
 */
export function nudgeElement(element, opts = {}) {
  const base =
    element.dataset.baseTransform ||
    element.style.transform ||
    "translate(-50%, -50%)";
  const updated = nudgeTransform(base, opts);
  element.style.transform = updated;
  element.dataset.lastTransform = updated;
}

/**
 * Apply a random nudge to a deck card's --base-transform CSS variable
 * and persist the new value in a transforms ref array.
 */
export function nudgeDeckCard(element, index, transformsRef, opts = {}) {
  const prev = transformsRef.current[index] || "translate(-50%, -50%)";
  const updated = nudgeTransform(prev, opts);
  transformsRef.current[index] = updated;
  element.style.setProperty("--base-transform", updated);
}
