// Solitaire Pure Logic Engine

import { SUITS, SUIT_COLORS, SUIT_SYMBOLS, VALUES, FOUNDATION_SUITS } from './constants';

/**
 * Generate a fresh 52-card deck
 */
export function createDeck() {
  const deck = [];
  for (const suitKey of Object.keys(SUITS)) {
    const suit = SUITS[suitKey];
    const color = SUIT_COLORS[suit];
    const symbol = SUIT_SYMBOLS[suit];

    for (const valObj of VALUES) {
      deck.push({
        id: `${suit}-${valObj.value}`,
        suit,
        color,
        symbol,
        value: valObj.value,
        label: valObj.label,
        name: valObj.name,
        isFaceUp: false,
      });
    }
  }
  return deck;
}

/**
 * Shuffle cards using Fisher-Yates algorithm
 */
export function shuffleDeck(cards) {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Deal a standard Klondike Solitaire game
 */
export function dealNewGame() {
  const deck = shuffleDeck(createDeck());
  const tableau = [[], [], [], [], [], [], []];

  let deckIndex = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = { ...deck[deckIndex++] };
      card.isFaceUp = row === col; // Only top card in column is face up
      tableau[col].push(card);
    }
  }

  const stock = deck.slice(deckIndex).map((card) => ({
    ...card,
    isFaceUp: false,
  }));

  const foundations = {
    [SUITS.HEARTS]: [],
    [SUITS.DIAMONDS]: [],
    [SUITS.CLUBS]: [],
    [SUITS.SPADES]: [],
  };

  return {
    tableau,
    stock,
    waste: [],
    foundations,
    score: 0,
    moves: 0,
    timeElapsed: 0,
    isWon: false,
  };
}

/**
 * Check if a card can be placed onto a target Tableau column
 */
export function canPlaceOnTableau(card, targetColumn) {
  if (!card) return false;
  if (!targetColumn || targetColumn.length === 0) {
    // Only King can go to an empty tableau column
    return card.value === 13;
  }
  const topCard = targetColumn[targetColumn.length - 1];
  if (!topCard.isFaceUp) return false;

  // Must alternate color and be descending by 1
  return card.color !== topCard.color && card.value === topCard.value - 1;
}

/**
 * Check if a card can be placed onto a Foundation pile of a given suit
 */
export function canPlaceOnFoundation(card, suit, foundationPile) {
  if (!card) return false;
  if (card.suit !== suit) return false;

  if (!foundationPile || foundationPile.length === 0) {
    // Only Ace can be the first card in foundation
    return card.value === 1;
  }

  const topCard = foundationPile[foundationPile.length - 1];
  return card.value === topCard.value + 1;
}

/**
 * Check if the game is won (all 4 foundations have 13 cards)
 */
export function checkWinState(foundations) {
  if (!foundations) return false;
  return FOUNDATION_SUITS.every(
    (suit) => foundations[suit] && foundations[suit].length === 13
  );
}

/**
 * Check if game is safe to auto-complete (no face-down cards left and stock/waste empty)
 */
export function canAutoComplete(tableau, stock, waste) {
  if (stock.length > 0 || waste.length > 0) return false;
  for (const column of tableau) {
    for (const card of column) {
      if (!card.isFaceUp) return false;
    }
  }
  return true;
}

/**
 * Find automatic move destination for double-click / smart tap
 */
export function findSmartDestination(card, tableau, foundations) {
  if (!card || !card.isFaceUp) return null;

  // 1. Try foundation first
  const targetFoundationPile = foundations[card.suit];
  if (canPlaceOnFoundation(card, card.suit, targetFoundationPile)) {
    return { type: 'foundation', suit: card.suit };
  }

  // 2. Try tableau columns
  for (let col = 0; col < tableau.length; col++) {
    const targetColumn = tableau[col];
    if (canPlaceOnTableau(card, targetColumn)) {
      return { type: 'tableau', columnIndex: col };
    }
  }

  return null;
}
