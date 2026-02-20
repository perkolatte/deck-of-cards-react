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
  /**
   * Nudge all visible cards with distance-based attenuation.
   * The touched card gets the full effect; cards farther away in either
   * direction get exponentially less.
   * @param {Object} opts - { maxOffset, maxRotation }
   * @param {number} origin - Index of the card that was touched.
   */
  const nudgeAll = useCallback(
    (opts, origin) => {
      const el = document.getElementById("deck");
      if (!el) return;
      el.querySelectorAll(".deck-card").forEach((img, i) => {
        if (img.style.display !== "none") {
          const dist = Math.abs(origin - i);
          const factor = Math.pow(0.4, dist); // 1, 0.4, 0.16, …
          nudgeDeckCard(img, i, transformsRef, {
            maxOffset: opts.maxOffset * factor,
            maxRotation: opts.maxRotation * factor,
          });
        }
      });
    },
    [transformsRef],
  );

  /**
   * Reset nudge on all visible cards with distance-based attenuation.
   * @param {Object} opts - { maxOffset, maxRotation }
   * @param {number} origin - Index of the card that was touched.
   */
  const resetAll = useCallback(
    (opts, origin) => {
      const el = document.getElementById("deck");
      if (!el) return;
      el.querySelectorAll(".deck-card").forEach((img, i) => {
        if (img.style.display !== "none") {
          const dist = Math.abs(origin - i);
          const factor = Math.pow(0.4, dist);
          nudgeDeckCard(img, i, transformsRef, {
            maxOffset: opts.maxOffset * factor,
            maxRotation: opts.maxRotation * factor,
          });
        }
      });
    },
    [transformsRef],
  );

  /** Resolve the deck-card index from a touch event target. */
  const touchIndex = (e) => {
    const card = e.target.closest(".deck-card");
    return card ? Number(card.dataset.index) : remaining - 1;
  };

  const handleTouchStart = (e) => {
    e.preventDefault(); // prevent mouse emulation
    nudgeAll({ maxOffset: 10, maxRotation: 20 }, touchIndex(e));
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
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
            data-index={i}
            data-pin-nopin="true"
            data-base-transform={transformsRef.current[i]}
            style={{
              display: show ? "block" : "none",
              zIndex: i + 1,
              "--base-transform": transformsRef.current[i],
            }}
            onMouseEnter={
              canHover
                ? (e) => {
                    const depth = remaining - 1 - i;
                    const factor = Math.pow(0.6, depth);
                    nudgeDeckCard(e.currentTarget, i, transformsRef, {
                      maxOffset: 10 * factor,
                      maxRotation: 20 * factor,
                    });
                  }
                : undefined
            }
            onMouseLeave={
              canHover
                ? (e) => {
                    const depth = remaining - 1 - i;
                    const factor = Math.pow(0.4, depth);
                    nudgeDeckCard(e.currentTarget, i, transformsRef, {
                      maxOffset: 5 * factor,
                      maxRotation: 10 * factor,
                    });
                  }
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
