import React from "react";
import { nudgeElement } from "../utils/transforms";

function nudgeAllCards(container, opts) {
  container
    .querySelectorAll(".card")
    .forEach((card) => nudgeElement(card, opts));
}

export default function DrawnCards({ drawn, onShuffle }) {
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

  const handleMouseOut = (e) => {
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
    e.currentTarget.style.transform = "";
    nudgeAllCards(e.currentTarget, { maxOffset: 3, maxRotation: 5 });
  };

  return (
    <div
      id="drawn-cards-container"
      aria-label="Drawn Cards"
      className={drawn.length ? "active" : ""}
      onClick={onShuffle}
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
