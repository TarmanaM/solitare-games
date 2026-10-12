// Solitaire Constants and Configuration

export const SUITS = {
  HEARTS: 'hearts',
  DIAMONDS: 'diamonds',
  CLUBS: 'clubs',
  SPADES: 'spades',
};

export const SUIT_SYMBOLS = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

export const SUIT_COLORS = {
  hearts: 'red',
  diamonds: 'red',
  clubs: 'black',
  spades: 'black',
};

export const VALUES = [
  { value: 1, label: 'A', name: 'Ace' },
  { value: 2, label: '2', name: '2' },
  { value: 3, label: '3', name: '3' },
  { value: 4, label: '4', name: '4' },
  { value: 5, label: '5', name: '5' },
  { value: 6, label: '6', name: '6' },
  { value: 7, label: '7', name: '7' },
  { value: 8, label: '8', name: '8' },
  { value: 9, label: '9', name: '9' },
  { value: 10, label: '10', name: '10' },
  { value: 11, label: 'J', name: 'Jack' },
  { value: 12, label: 'Q', name: 'Queen' },
  { value: 13, label: 'K', name: 'King' },
];

export const FOUNDATION_SUITS = [
  SUITS.HEARTS,
  SUITS.DIAMONDS,
  SUITS.CLUBS,
  SUITS.SPADES,
];

// Standard Klondike Scoring
export const SCORE_RULES = {
  WASTE_TO_TABLEAU: 5,
  WASTE_TO_FOUNDATION: 10,
  TABLEAU_TO_FOUNDATION: 10,
  TURN_TABLEAU_CARD: 5,
  FOUNDATION_TO_TABLEAU: -15,
  RECYCLE_WASTE: -20,
};
