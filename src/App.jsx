import React, { useEffect, useRef, useState } from "react";
import { createDeck, drawFromDeck, shuffleDeck } from "./utils/api";
import { generateBaseTransforms, drawnCardStyle } from "./utils/transforms";
import Controls from "./components/Controls";
import Deck from "./components/Deck";
import DrawnCards from "./components/DrawnCards";

/**
 * Root application component.
 * Manages deck state and orchestrates Controls, DrawnCards, and Deck.
 */
export default function App() {
  const [deckId, setDeckId] = useState(null);
  const [remaining, setRemaining] = useState(52);
  const [drawn, setDrawn] = useState([]);
  const [error, setError] = useState(null);
  const transformsRef = useRef(generateBaseTransforms(52));
  const [isDrawing, setIsDrawing] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const timerRef = useRef(null);
  const drawRef = useRef(null);
  const NO_CARDS_ERROR = "No cards remaining!";

  /** Keep drawRef current so the interval always calls the latest logic. */
  drawRef.current = async () => {
    try {
      const res = await drawFromDeck(deckId, 1);
      if (res.remaining === 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setIsDrawing(false);
        setError(NO_CARDS_ERROR);
      }
      setRemaining(res.remaining);
      const card = { ...res.cards[0], style: drawnCardStyle() };
      setDrawn((prev) => [...prev, card]);
    } catch {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsDrawing(false);
    }
  };

  /** Create a new shuffled deck on mount. */
  useEffect(() => {
    let mounted = true;
    createDeck().then((data) => {
      if (!mounted) return;
      setDeckId(data.deck_id);
      setRemaining(data.remaining ?? 52);
    });
    return () => {
      mounted = false;
    };
  }, []);

  /** Draw one card from the deck and add it to the drawn pile. */
  const handleDraw = async () => {
    if (!deckId) return;
    if (remaining === 0) {
      setError(NO_CARDS_ERROR);
      return;
    }
    setError(null);
    try {
      const res = await drawFromDeck(deckId, 1);
      setRemaining(res.remaining);
      const card = { ...res.cards[0], style: drawnCardStyle() };
      setDrawn((prev) => [...prev, card]);
    } catch (err) {
      console.error(err);
    }
  };

  /** Shuffle all cards back into the deck and reset state. */
  const handleShuffle = async () => {
    if (!deckId) return;
    try {
      await shuffleDeck(deckId);
      setDrawn([]);
      setRemaining(52);
      setError(null);
      transformsRef.current = generateBaseTransforms(52);
    } catch (err) {
      console.error(err);
    }
  };

  /** Start or stop auto-drawing one card per interval. */
  const toggleAutoDraw = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsDrawing(false);
    } else {
      setIsDrawing(true);
      timerRef.current = setInterval(() => drawRef.current(), speed);
    }
  };

  /** Helper to restart the interval at a new speed. */
  const startInterval = (ms) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => drawRef.current(), ms);
  };

  /** Decrease interval (draw faster), minimum 200ms. */
  const handleFaster = () => {
    const next = Math.max(200, speed - 200);
    setSpeed(next);
    if (isDrawing) startInterval(next);
  };

  /** Increase interval (draw slower), maximum 3000ms. */
  const handleSlower = () => {
    const next = Math.min(3000, speed + 200);
    setSpeed(next);
    if (isDrawing) startInterval(next);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <main id="game-container">
      <Controls
        remaining={remaining}
        drawnCount={drawn.length}
        onDraw={handleDraw}
        onShuffle={handleShuffle}
        onToggleAutoDraw={toggleAutoDraw}
        isDrawing={isDrawing}
        speed={speed}
        onFaster={handleFaster}
        onSlower={handleSlower}
        error={error}
      />
      <div className="cards-area">
        <DrawnCards drawn={drawn} onShuffle={handleShuffle} />
        <Deck
          remaining={remaining}
          transformsRef={transformsRef}
          onDraw={handleDraw}
        />
      </div>
    </main>
  );
}
