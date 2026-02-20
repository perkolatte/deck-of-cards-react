import React from "react";
import { randomTransform } from "../utils/transforms";

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
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              const { offsetX, offsetY, rotation } = randomTransform({
                maxOffset: isTop ? 10 : 5,
                maxRotation: isTop ? 20 : 10,
              });
              const prevBase =
                transformsRef.current[i] || "translate(-50%, -50%)";
              const newBase = `${prevBase} translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
              transformsRef.current[i] = newBase;
              el.style.setProperty("--base-transform", newBase);
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              const { offsetX, offsetY, rotation } = randomTransform({
                maxOffset: isTop ? 5 : 3,
                maxRotation: isTop ? 10 : 5,
              });
              const prevBase =
                transformsRef.current[i] || "translate(-50%, -50%)";
              const newBase = `${prevBase} translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
              transformsRef.current[i] = newBase;
              el.style.setProperty("--base-transform", newBase);
            }}
          />
        );
      })}
    </div>
  );
}
