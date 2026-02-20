import React, { useEffect, useRef, useState } from "react";

// API helpers
async function makeCall(call, errorText) {
  const res = await fetch(call);
  if (!res.ok) throw new Error(`${errorText} ${res.status} ${res.statusText}`);
  return res.json();
}

async function createDeck(shuffled = true) {
  const path = shuffled ? "shuffle/" : "";
  return makeCall(
    `https://deckofcardsapi.com/api/deck/new/${path}`,
    "Failed creating deck",
  );
}

async function drawFromDeck(deckId, count = 1) {
  return makeCall(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`,
    "Failed drawing cards",
  );
}

async function shuffleDeck(deckId) {
  return makeCall(
    `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/?remaining=false`,
    "Failed shuffling",
  );
}

function genTransforms(n) {
  return Array.from({ length: n }).map(() => {
    const rx = Math.random() * 4 - 2;
    const ry = Math.random() * 4 - 2;
    const rrot = Math.random() * 4 - 2;
    return `translate(-50%, -50%) translate(${rx}px, ${ry}px) rotate(${rrot}deg)`;
  });
}

// Hover helpers (mirror previous vanilla behavior)
function randomTransform({ maxOffset = 10, maxRotation = 10 } = {}) {
  const offsetX = Math.random() * maxOffset * 2 - maxOffset;
  const offsetY = Math.random() * maxOffset * 2 - maxOffset;
  const rotation = Math.random() * maxRotation * 2 - maxRotation;
  return { offsetX, offsetY, rotation };
}

function applyTransformToElement(
  element,
  { offsetX, offsetY, rotation },
  scale = 1,
) {
  // If this is a deck card, update the CSS variable so CSS hover scaling composes correctly.
  if (element.classList && element.classList.contains("deck-card")) {
    const base =
      element.dataset.baseTransform ||
      element.style.getPropertyValue("--base-transform") ||
      "translate(-50%, -50%)";
    const newBase = `${base} translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
    element.style.setProperty("--base-transform", newBase);
    element.dataset.lastTransform = newBase;
    return;
  }

  const baseTransform =
    element.dataset.baseTransform ||
    element.style.transform ||
    "translate(-50%, -50%)";
  const newTransform = `${baseTransform} translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${rotation}deg)`;
  element.style.transform = newTransform;
  element.dataset.lastTransform = newTransform;
}

export default function App() {
  const [deckId, setDeckId] = useState(null);
  const [remaining, setRemaining] = useState(52);
  const [drawn, setDrawn] = useState([]);
  const transformsRef = useRef(genTransforms(52));

  useEffect(() => {
    let mounted = true;
    createDeck().then((data) => {
      if (!mounted) return;
      setDeckId(data.deck_id);
      setRemaining(data.remaining ?? 52);
    });
    return () => (mounted = false);
  }, []);

  const handleDraw = async () => {
    if (!deckId || remaining === 0) return;
    try {
      const res = await drawFromDeck(deckId, 1);
      setRemaining(res.remaining);
      // attach a small random transform to each drawn card for visual variety
      const tx = Math.random() * 40 - 20;
      const ty = Math.random() * 40 - 20;
      const rot = Math.random() * 40 - 20;
      const card = {
        ...res.cards[0],
        style: {
          transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotate(${rot}deg)`,
        },
      };
      setDrawn((d) => [...d, card]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShuffle = async () => {
    if (!deckId) return;
    try {
      await shuffleDeck(deckId);
      setDrawn([]);
      setRemaining(52);
    } catch (e) {
      console.error(e);
    }
  };

  // Deck hover handlers (delegated)
  const handleDeckMouseOver = (e) => {
    const target = e.target.closest(".deck-card");
    if (!target) return;
    const isTop = target.classList.contains("top-card");
    const { offsetX, offsetY, rotation } = randomTransform({
      maxOffset: isTop ? 10 : 5,
      maxRotation: isTop ? 20 : 10,
    });
    applyTransformToElement(
      target,
      { offsetX, offsetY, rotation },
      isTop ? 1.1 : 1,
    );
  };

  const handleDeckMouseOut = (e) => {
    const target = e.target.closest(".deck-card");
    if (!target) return;
    const transform =
      target.dataset.lastTransform ||
      target.dataset.baseTransform ||
      "translate(-50%, -50%)";
    const updated = transform.replace(/scale\([^)]+\)/, "scale(1)");
    target.style.transform = updated;
  };

  // Drawn cards hover handlers
  const handleDrawnMouseOver = (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.style.transform = "scale(1.1)";
      return;
    }
    const card = e.target.closest(".card");
    if (!card) return;
    const { offsetX, offsetY, rotation } = randomTransform({
      maxOffset: 5,
      maxRotation: 10,
    });
    applyTransformToElement(card, { offsetX, offsetY, rotation }, 1);
  };

  const handleDrawnMouseOut = (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.style.transform = "";
      return;
    }
    const card = e.target.closest(".card");
    if (!card) return;
    const transform =
      card.dataset.lastTransform ||
      card.dataset.baseTransform ||
      "translate(-50%, -50%)";
    const updated = transform.replace(/scale\([^)]+\)/, "scale(1)");
    card.style.transform = updated;
  };

  return (
    <div id="game-container" role="main">
      <div
        className="controls"
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <button
          onClick={handleDraw}
          disabled={remaining === 0}
          aria-disabled={remaining === 0}
        >
          Draw
        </button>
        <button
          onClick={handleShuffle}
          disabled={drawn.length === 0}
          aria-disabled={drawn.length === 0}
        >
          Shuffle
        </button>
        <div style={{ marginLeft: "auto" }} aria-live="polite">
          Remaining: <strong>{remaining}</strong>
        </div>
      </div>

      <div
        id="drawn-cards-container"
        aria-label="Drawn Cards"
        className={drawn.length ? "active" : ""}
        onClick={handleShuffle}
        onMouseOver={handleDrawnMouseOver}
        onMouseOut={handleDrawnMouseOut}
      >
        {drawn.map((c, i) => (
          // eslint-disable-next-line react/no-array-index-key
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

      <div
        id="deck"
        aria-label="Deck of Cards"
        onClick={handleDraw}

      >
        {Array.from({ length: 52 }).map((_, i) => {
          const show = i < remaining;
          return (
            <img
              key={i}
              src="/images/back.png"
              alt="Shuffle deck, face down"
              className={`deck-card ${i === remaining - 1 ? "top-card" : ""}`}
              data-pin-nopin="true"
              data-base-transform={transformsRef.current[i]}
              style={{
                display: show ? "block" : "none",
                zIndex: i + 1,
                // set the CSS variable used by stylesheet for the base transform
                ["--base-transform"]: transformsRef.current[i],
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                const isTop = i === remaining - 1;
                const { offsetX, offsetY, rotation } = randomTransform({
                  maxOffset: isTop ? 10 : 5,
                  maxRotation: isTop ? 20 : 10,
                });
                // Build new base with random offset/rotation baked in
                const prevBase = transformsRef.current[i] || "translate(-50%, -50%)";
                const newBase = `${prevBase} translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
                // Persist so card keeps its new position
                transformsRef.current[i] = newBase;
                // Update CSS variable — CSS :hover rule handles scale for top card
                el.style.setProperty("--base-transform", newBase);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
