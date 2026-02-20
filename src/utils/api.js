const BASE_URL = "https://deckofcardsapi.com/api/deck";

/**
 * Generic fetch wrapper that throws on non-OK responses.
 * @param {string} url - API endpoint to call.
 * @param {string} errorText - Human-readable prefix for error messages.
 * @returns {Promise<Object>} Parsed JSON response.
 */
async function makeCall(url, errorText) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${errorText} (${res.status} ${res.statusText})`);
  }
  return res.json();
}

/**
 * Create a new deck, optionally shuffled.
 * @param {boolean} [shuffled=true] - Whether to shuffle the new deck.
 * @returns {Promise<Object>} Deck data including `deck_id` and `remaining`.
 */
export async function createDeck(shuffled = true) {
  const path = shuffled ? "shuffle/" : "";
  return makeCall(`${BASE_URL}/new/${path}`, "Failed creating deck");
}

/**
 * Draw cards from an existing deck.
 * @param {string} deckId - The deck identifier.
 * @param {number} [count=1] - Number of cards to draw.
 * @returns {Promise<Object>} Response containing drawn `cards` and `remaining`.
 */
export async function drawFromDeck(deckId, count = 1) {
  return makeCall(
    `${BASE_URL}/${deckId}/draw/?count=${count}`,
    "Failed drawing cards",
  );
}

/**
 * Shuffle all cards (including already-drawn) back into the deck.
 * @param {string} deckId - The deck identifier.
 * @returns {Promise<Object>} Shuffle confirmation data.
 */
export async function shuffleDeck(deckId) {
  return makeCall(
    `${BASE_URL}/${deckId}/shuffle/?remaining=false`,
    "Failed shuffling",
  );
}
