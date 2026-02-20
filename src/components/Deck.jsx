import React, { useCallback, useRef } from "react";
import { nudgeDeckCard } from "../utils/transforms";
import backImg from "../assets/back.png";

/** True when the primary input supports hover (not a touchscreen). */
const canHover = window.matchMedia("(hover: hover)").matches;

/**
 * Visual deck of 52 face-down card images.
 * Desktop: hover nudges cards, click draws.
 * Mobile: press nudges cards, release draws.
 * @param {Object} props
 * @param {number} props.remaining - Cards left in the deck.
 * @param {React.MutableRefObject<string[]>} props.transformsRef - Mutable ref holding per-card transforms.
 * @param {Function} props.onDraw - Callback fired when the deck is clicked/tapped.
 */
export default function Deck({ remaining, transformsRef, onDraw }) {
  /** Nudge all visible cards (press / hover-enter effect). */
  const nudgeAll = useCallback(
    (opts) => {
      const el = document.getElementById("deck");
      if (!el) return;
      el.querySelectorAll(".deck-card").forEach((img, i) => {
        if (img.style.display !== "none") {
          nudgeDeckCard(img, i, transformsRef, opts);
        }
      });
    },
    [transformsRef],
  );

  /** Reset nudge on all visible cards (release / hover-leave effect). */
  const resetAll = useCallback(
    (opts) => {
      const el = document.getElementById("deck");
      if (!el) return;
      el.querySelectorAll(".deck-card").forEach((img, i) => {
        if (img.style.display !== "none") {
          nudgeDeckCard(img, i, transformsRef, opts);
        }
      });
    },
    [transformsRef],
  );

  const handleTouchStart = (e) => {
    e.preventDefault(); // prevent mouse emulation
    nudgeAll({ maxOffset: 10, maxRotation: 20 });
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    resetAll({ maxOffset: 5, maxRotation: 10 });
    onDraw();
  };

  return (
    <div
      id="deck"
      role="button"
      tabIndex={0}
      aria-label={`Deck: ${remaining} cards remaining. Click to draw.`}
      onClick={onDraw}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onDraw();
        }
      }}
    >
      {Array.from({ length: 52 }).map((_, i) => {
        const show = i < remaining;
        const isTop = i === remaining - 1;

        return (
          <img
            key={i}
            src={backImg}
            alt=""
            aria-hidden="true"
            className={`deck-card${isTop ? " top-card" : ""}`}
            data-pin-nopin="true"
            data-base-transform={transformsRef.current[i]}
            style={{
              display: show ? "block" : "none",
              zIndex: i + 1,
              "--base-transform": transformsRef.current[i],
            }}
            onMouseEnter={
              canHover
                ? (e) =>
                    nudgeDeckCard(e.currentTarget, i, transformsRef, {
                      maxOffset: isTop ? 10 : 5,
                      maxRotation: isTop ? 20 : 10,
                    })
                : undefined
            }
            onMouseLeave={
              canHover
                ? (e) =>
                    nudgeDeckCard(e.currentTarget, i, transformsRef, {
                      maxOffset: isTop ? 5 : 3,
                      maxRotation: isTop ? 10 : 5,
                    })
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
