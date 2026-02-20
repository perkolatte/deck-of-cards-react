import React from "react";
import { nudgeElement } from "../utils/transforms";

/**
 * Nudge every `.card` element inside a container with a random transform.
 * @param {HTMLElement} container - Parent element to query within.
 * @param {Object} opts - Options forwarded to nudgeElement.
 */
function nudgeAllCards(container, opts) {
  container
    .querySelectorAll(".card")
    .forEach((card) => nudgeElement(card, opts));
}

/**
 * Drawn / discard card pile.
 * Scales up on hover and nudges all cards for a tactile feel.
 * @param {Object} props
 * @param {Object[]} props.drawn - Array of drawn card objects with `image`, `value`, `suit`, and `style`.
 * @param {Function} props.onShuffle - Callback fired when the pile is clicked.
 */
export default function DrawnCards({ drawn, onShuffle }) {
  /** Scale the container and nudge all cards on mouse enter. */
  const handleMouseOver = (e) => {
    if (
      e.currentTarget !== e.target &&
      e.relatedTarget &&
      e.currentTarget.contains(e.relatedTarget)
    )
      return;
    e.currentTarget.style.transform = "scale(1.1)";
    nudgeAllCards(e.currentTarget, { maxOffset: 5, maxRotation: 10 });
  };

  /** Reset container scale and re-nudge cards on mouse leave. */
  const handleMouseOut = (e) => {
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
    e.currentTarget.style.transform = "";
    nudgeAllCards(e.currentTarget, { maxOffset: 3, maxRotation: 5 });
  };

  return (
    <div
      id="drawn-cards-container"
      role="button"
      tabIndex={0}
      aria-label={`Drawn pile: ${drawn.length} cards. Click to shuffle back.`}
      className={drawn.length ? "active" : ""}
      onClick={onShuffle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onShuffle(); } }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {drawn.map((c, i) => (
        <img
          key={i}
          src={c.image}
          alt={`${c.value} of ${c.suit}`}
          className="card"
          style={c.style}
          data-pin-nopin="true"
        />
      ))}
    </div>
  );
}
