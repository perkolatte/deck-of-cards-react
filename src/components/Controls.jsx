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
export default function Controls({
  remaining,
  drawnCount,
  onDraw,
  onShuffle,
  error,
  isDrawing,
  onToggleAutoDraw,
  speed,
  onFaster,
  onSlower,
}) {
  return (
    <nav className="controls" aria-label="Game controls">
      <button onClick={onDraw} disabled={remaining === 0}>
        Draw
      </button>
      <button
        onClick={onToggleAutoDraw}
        disabled={!remaining && !isDrawing}
        aria-label={isDrawing ? "Stop auto draw" : "Start auto draw"}
      >
        {isDrawing ? "Stop" : "Auto"}
      </button>
      <button
        onClick={onFaster}
        disabled={speed <= 200}
        aria-label={`Draw faster, current speed ${speed} milliseconds`}
      >
        Faster
      </button>
      <button
        onClick={onSlower}
        disabled={speed >= 3000}
        aria-label={`Draw slower, current speed ${speed} milliseconds`}
      >
        Slower
      </button>
      <button onClick={onShuffle} disabled={drawnCount === 0}>
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
    </nav>
  );
}
