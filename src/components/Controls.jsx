import React from "react";

export default function Controls({ remaining, drawnCount, onDraw, onShuffle }) {
  return (
    <div className="controls">
      <button
        onClick={onDraw}
        disabled={remaining === 0}
        aria-disabled={remaining === 0}
      >
        Draw
      </button>
      <button
        onClick={onShuffle}
        disabled={drawnCount === 0}
        aria-disabled={drawnCount === 0}
      >
        Shuffle
      </button>
      <div className="remaining" aria-live="polite">
        Remaining: <strong>{remaining}</strong>
      </div>
    </div>
  );
}
