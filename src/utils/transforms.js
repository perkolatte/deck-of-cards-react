/**
 * Generate an array of n random CSS transform strings for card positioning.
 * @param {number} n - Number of transforms to generate.
 * @returns {string[]} Array of CSS transform strings.
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
 * @param {Object} [options] - Optional bounds.
 * @param {number} [options.maxOffset=10] - Maximum pixel offset in each axis.
 * @param {number} [options.maxRotation=10] - Maximum rotation in degrees.
 * @returns {{offsetX: number, offsetY: number, rotation: number}} Random transform values.
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
 * @returns {{transform: string}} Style object for a drawn card.
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
 * Append a random offset/rotation to a base transform string.
 * @param {string} base - Starting CSS transform string.
 * @param {Object} [options] - Optional bounds forwarded to randomTransform.
 * @param {number} [options.maxOffset=5] - Maximum pixel offset.
 * @param {number} [options.maxRotation=10] - Maximum rotation in degrees.
 * @returns {string} Combined CSS transform string.
 */
export function nudgeTransform(base, { maxOffset = 5, maxRotation = 10 } = {}) {
  const { offsetX, offsetY, rotation } = randomTransform({
    maxOffset,
    maxRotation,
  });
  return `${base} translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
}

/**
 * Apply a random nudge to an element's inline transform.
 * Reads the current base from data-base-transform, inline style, or a default.
 * @param {HTMLElement} element - DOM element to nudge.
 * @param {Object} [opts] - Options forwarded to nudgeTransform.
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
 * @param {HTMLElement} element - The deck card DOM element.
 * @param {number} index - Card index in the transforms array.
 * @param {React.MutableRefObject<string[]>} transformsRef - Mutable ref holding per-card transforms.
 * @param {Object} [opts] - Options forwarded to nudgeTransform.
 */
export function nudgeDeckCard(element, index, transformsRef, opts = {}) {
  const prev = transformsRef.current[index] || "translate(-50%, -50%)";
  const updated = nudgeTransform(prev, opts);
  transformsRef.current[index] = updated;
  element.style.setProperty("--base-transform", updated);
}
