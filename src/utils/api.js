const BASE_URL = "https://deckofcardsapi.com/api/deck";

async function makeCall(url, errorText) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${errorText} (${res.status} ${res.statusText})`);
  }
  return res.json();
}

export async function createDeck(shuffled = true) {
  const path = shuffled ? "shuffle/" : "";
  return makeCall(`${BASE_URL}/new/${path}`, "Failed creating deck");
}

export async function drawFromDeck(deckId, count = 1) {
  return makeCall(
    `${BASE_URL}/${deckId}/draw/?count=${count}`,
    "Failed drawing cards",
  );
}

export async function shuffleDeck(deckId) {
  return makeCall(
    `${BASE_URL}/${deckId}/shuffle/?remaining=false`,
    "Failed shuffling",
  );
}
