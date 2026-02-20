import React from "react";
import { randomTransform } from "../utils/transforms";

function applyHoverTransform(element, { offsetX, offsetY, rotation }) {
  const base =
    element.dataset.baseTransform ||
    element.style.transform ||
    "translate(-50%, -50%)";
  const updated = `${base} translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
  element.style.transform = updated;
  element.dataset.lastTransform = updated;
}

function resetHoverTransform(element) {
  const transform =
    element.dataset.lastTransform ||
    element.dataset.baseTransform ||
    "translate(-50%, -50%)";
  const updated = transform.replace(/scale\([^)]+\)/, "scale(1)");
  element.style.transform = updated;
}

export default function DrawnCards({ drawn, onShuffle }) {
  // Apply random rotation to every card in the pile on enter/leave
  const nudgeAllCards = (container, maxOffset, maxRotation) => {
    const cards = container.querySelectorAll(".card");
    cards.forEach((card) => {
      const t = randomTransform({ maxOffset, maxRotation });
      applyHoverTransform(card, t);
    });
  };

  const handleMouseOver = (e) => {
    // Only trigger when entering the container itself, not bubbling between cards
    if (e.currentTarget !== e.target && e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
    e.currentTarget.style.transform = "scale(1.1)";
    nudgeAllCards(e.currentTarget, 5, 10);
  };

  const handleMouseOut = (e) => {
    // Only trigger when leaving the container entirely
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
    e.currentTarget.style.transform = "";
    nudgeAllCards(e.currentTarget, 3, 5);
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
