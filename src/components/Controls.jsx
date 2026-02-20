import React from "react";

/**
 * Draw / Shuffle buttons and remaining-card counter.
 * @param {Object} props
 * @param {number} props.remaining - Cards left in the deck.
 * @param {number} props.drawnCount - Number of cards already drawn.
 * @param {Function} props.onDraw - Callback for the Draw button.
 * @param {Function} props.onShuffle - Callback for the Shuffle button.
 * @param {string|null} props.error - Error message to display, or null.
 */
export default function Controls({ remaining, drawnCount, onDraw, onShuffle, error }) {
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
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
