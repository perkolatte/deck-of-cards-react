import React from "react";
import { nudgeDeckCard } from "../utils/transforms";

export default function Deck({ remaining, transformsRef, onDraw }) {
  return (
    <div id="deck" aria-label="Deck of Cards" onClick={onDraw}>
      {Array.from({ length: 52 }).map((_, i) => {
        const show = i < remaining;
        const isTop = i === remaining - 1;

        return (
          <img
            key={i}
            src="/images/back.png"
            alt="Shuffle deck, face down"
            className={`deck-card${isTop ? " top-card" : ""}`}
            data-pin-nopin="true"
            data-base-transform={transformsRef.current[i]}
            style={{
              display: show ? "block" : "none",
              zIndex: i + 1,
              "--base-transform": transformsRef.current[i],
            }}
            onMouseEnter={(e) =>
              nudgeDeckCard(e.currentTarget, i, transformsRef, {
                maxOffset: isTop ? 10 : 5,
                maxRotation: isTop ? 20 : 10,
              })
            }
            onMouseLeave={(e) =>
              nudgeDeckCard(e.currentTarget, i, transformsRef, {
                maxOffset: isTop ? 5 : 3,
                maxRotation: isTop ? 10 : 5,
              })
            }
          />
        );
      })}
    </div>
  );
}
