import React, { useEffect, useRef, useState } from "react";
import { createDeck, drawFromDeck, shuffleDeck } from "./utils/api";
import { generateBaseTransforms, drawnCardStyle } from "./utils/transforms";
import Controls from "./components/Controls";
import Deck from "./components/Deck";
import DrawnCards from "./components/DrawnCards";

export default function App() {
  const [deckId, setDeckId] = useState(null);
  const [remaining, setRemaining] = useState(52);
  const [drawn, setDrawn] = useState([]);
  const transformsRef = useRef(generateBaseTransforms(52));

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

  const handleDraw = async () => {
    if (!deckId || remaining === 0) return;
    try {
      const res = await drawFromDeck(deckId, 1);
      setRemaining(res.remaining);
      const card = { ...res.cards[0], style: drawnCardStyle() };
      setDrawn((prev) => [...prev, card]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShuffle = async () => {
    if (!deckId) return;
    try {
      await shuffleDeck(deckId);
      setDrawn([]);
      setRemaining(52);
      transformsRef.current = generateBaseTransforms(52);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="game-container" role="main">
      <Controls
        remaining={remaining}
        drawnCount={drawn.length}
        onDraw={handleDraw}
        onShuffle={handleShuffle}
      />
      <DrawnCards drawn={drawn} onShuffle={handleShuffle} />
      <Deck
        remaining={remaining}
        transformsRef={transformsRef}
        onDraw={handleDraw}
      />
    </div>
  );
}
