import { create } from 'zustand';
import {
  dealNewGame,
  canPlaceOnTableau,
  canPlaceOnFoundation,
  checkWinState,
  canAutoComplete,
  findSmartDestination,
} from '@/lib/solitaire/engine';
import { SCORE_RULES, FOUNDATION_SUITS } from '@/lib/solitaire/constants';

// Deep clone state for undo history
const snapshotState = (state) => ({
  tableau: state.tableau.map((col) => col.map((c) => ({ ...c }))),
  foundations: {
    hearts: state.foundations.hearts.map((c) => ({ ...c })),
    diamonds: state.foundations.diamonds.map((c) => ({ ...c })),
    clubs: state.foundations.clubs.map((c) => ({ ...c })),
    spades: state.foundations.spades.map((c) => ({ ...c })),
  },
  stock: state.stock.map((c) => ({ ...c })),
  waste: state.waste.map((c) => ({ ...c })),
  score: state.score,
  moves: state.moves,
});

export const useSolitaireStore = create((set, get) => ({
  // Game state
  tableau: [[], [], [], [], [], [], []],
  foundations: { hearts: [], diamonds: [], clubs: [], spades: [] },
  stock: [],
  waste: [],
  drawCount: 1, // 1 card or 3 cards draw
  score: 0,
  moves: 0,
  timeElapsed: 0,
  timerActive: false,
  isWon: false,
  isAutoCompletePossible: false,
  isAutoCompleting: false,
  history: [],
  selectedCard: null, // { card, source: { type, colIndex, cardIndex, suit } }
  draggedSource: null, // Active drag source metadata { type, colIndex, cardIndex, suit }
  notification: null, // { message, severity: 'info' | 'success' | 'error' }

  // Drag and drop actions
  setDraggedSource: (source) => set({ draggedSource: source }),
  clearDraggedSource: () => set({ draggedSource: null }),

  // In-app notifications
  showNotification: (message, severity = 'info') =>
    set({ notification: { message, severity } }),
  hideNotification: () => set({ notification: null }),

  // Initialize or restart game
  startNewGame: () => {
    const initialState = dealNewGame();
    set({
      ...initialState,
      drawCount: get().drawCount || 1,
      timerActive: true,
      isWon: false,
      isAutoCompletePossible: false,
      isAutoCompleting: false,
      history: [],
      selectedCard: null,
      timeElapsed: 0,
    });
  },

  // Toggle between Draw 1 and Draw 3 mode
  setDrawCount: (count) => {
    set({ drawCount: count });
  },

  // Draw card(s) from Stock into Waste or recycle Waste
  drawCards: () => {
    const { stock, waste, drawCount, score, moves, history, isWon } = get();
    if (isWon) return;

    const currentSnapshot = snapshotState(get());

    if (stock.length > 0) {
      const numToDraw = Math.min(drawCount, stock.length);
      const newStock = [...stock];
      const drawnCards = [];

      for (let i = 0; i < numToDraw; i++) {
        const card = { ...newStock.pop(), isFaceUp: true };
        drawnCards.push(card);
      }

      set({
        stock: newStock,
        waste: [...waste, ...drawnCards],
        moves: moves + 1,
        selectedCard: null,
        history: [...history.slice(-30), currentSnapshot],
      });
    } else if (waste.length > 0) {
      // Recycle waste back into stock
      const recycledStock = waste
        .map((c) => ({ ...c, isFaceUp: false }))
        .reverse();

      const newScore = Math.max(0, score + SCORE_RULES.RECYCLE_WASTE);

      set({
        stock: recycledStock,
        waste: [],
        score: newScore,
        moves: moves + 1,
        selectedCard: null,
        history: [...history.slice(-30), currentSnapshot],
      });
    }
  },

  // Handle card selection & click-to-move
  handleCardClick: (card, source) => {
    const { selectedCard, handleDestinationClick } = get();

    if (!selectedCard) {
      if (card && card.isFaceUp) {
        set({ selectedCard: { card, source } });
      }
      return;
    }

    // If same card clicked, deselect
    if (selectedCard.card.id === card?.id) {
      set({ selectedCard: null });
      return;
    }

    // Otherwise treat as destination click
    let destination = null;
    if (source.type === 'tableau') {
      destination = { type: 'tableau', colIndex: source.colIndex };
    } else if (source.type === 'foundation') {
      destination = { type: 'foundation', suit: source.suit };
    }

    if (destination) {
      handleDestinationClick(destination);
    } else {
      // Switch selection if clicked another face-up card
      if (card && card.isFaceUp) {
        set({ selectedCard: { card, source } });
      } else {
        set({ selectedCard: null });
      }
    }
  },

  // Execute destination move from selectedCard
  handleDestinationClick: (destination) => {
    const { selectedCard, executeMove } = get();
    if (!selectedCard) return false;

    const success = executeMove(selectedCard.source, destination);
    if (success) {
      set({ selectedCard: null });
    }
    return success;
  },

  // Core move execution with full validation & score updates
  executeMove: (source, destination) => {
    const state = get();
    if (state.isWon) return false;

    // 1. Resolve moving cards
    let movingCards = [];
    if (source.type === 'waste') {
      if (state.waste.length === 0) return false;
      movingCards = [state.waste[state.waste.length - 1]];
    } else if (source.type === 'foundation') {
      const fPile = state.foundations[source.suit];
      if (!fPile || fPile.length === 0) return false;
      movingCards = [fPile[fPile.length - 1]];
    } else if (source.type === 'tableau') {
      const col = state.tableau[source.colIndex];
      if (!col || source.cardIndex >= col.length) return false;
      movingCards = col.slice(source.cardIndex);
      if (movingCards.length === 0 || !movingCards[0].isFaceUp) return false;
    }

    if (movingCards.length === 0) return false;
    const leadCard = movingCards[0];

    // 2. Validate against destination
    let isValid = false;
    let scoreChange = 0;

    if (destination.type === 'tableau') {
      const targetColumn = state.tableau[destination.colIndex];
      // Can't move to same column
      if (source.type === 'tableau' && source.colIndex === destination.colIndex) {
        return false;
      }
      if (canPlaceOnTableau(leadCard, targetColumn)) {
        isValid = true;
        if (source.type === 'waste') {
          scoreChange = SCORE_RULES.WASTE_TO_TABLEAU;
        } else if (source.type === 'foundation') {
          scoreChange = SCORE_RULES.FOUNDATION_TO_TABLEAU;
        }
      }
    } else if (destination.type === 'foundation') {
      // Foundation only accepts 1 card at a time
      if (movingCards.length !== 1) return false;

      const suit = destination.suit || leadCard.suit;
      const foundationPile = state.foundations[suit];

      if (canPlaceOnFoundation(leadCard, suit, foundationPile)) {
        isValid = true;
        if (source.type === 'waste') {
          scoreChange = SCORE_RULES.WASTE_TO_FOUNDATION;
        } else if (source.type === 'tableau') {
          scoreChange = SCORE_RULES.TABLEAU_TO_FOUNDATION;
        }
      }
    }

    if (!isValid) return false;

    // Save snapshot before mutating
    const currentSnapshot = snapshotState(state);

    // 3. Apply state changes
    const newTableau = state.tableau.map((col) => [...col]);
    const newFoundations = {
      hearts: [...state.foundations.hearts],
      diamonds: [...state.foundations.diamonds],
      clubs: [...state.foundations.clubs],
      spades: [...state.foundations.spades],
    };
    let newWaste = [...state.waste];

    // Remove from source
    if (source.type === 'waste') {
      newWaste.pop();
    } else if (source.type === 'foundation') {
      newFoundations[source.suit].pop();
    } else if (source.type === 'tableau') {
      newTableau[source.colIndex] = newTableau[source.colIndex].slice(
        0,
        source.cardIndex
      );
      // Check if newly exposed top card needs to be turned face-up
      const col = newTableau[source.colIndex];
      if (col.length > 0 && !col[col.length - 1].isFaceUp) {
        col[col.length - 1] = { ...col[col.length - 1], isFaceUp: true };
        scoreChange += SCORE_RULES.TURN_TABLEAU_CARD;
      }
    }

    // Add to destination
    if (destination.type === 'tableau') {
      newTableau[destination.colIndex] = [
        ...newTableau[destination.colIndex],
        ...movingCards,
      ];
    } else if (destination.type === 'foundation') {
      const suit = destination.suit || leadCard.suit;
      newFoundations[suit] = [...newFoundations[suit], leadCard];
    }

    const isWon = checkWinState(newFoundations);
    const isAutoPossible = canAutoComplete(
      newTableau,
      state.stock,
      newWaste
    );

    set({
      tableau: newTableau,
      foundations: newFoundations,
      waste: newWaste,
      score: Math.max(0, state.score + scoreChange),
      moves: state.moves + 1,
      isWon,
      timerActive: !isWon,
      isAutoCompletePossible: isAutoPossible,
      history: [...state.history.slice(-30), currentSnapshot],
      selectedCard: null,
      draggedSource: null,
    });

    return true;
  },

  // Smart Move (Double Click / Quick Tap): Automatically find valid foundation or tableau slot
  smartMove: (card, source) => {
    const state = get();
    if (!card || !card.isFaceUp || state.isWon) return false;

    // For tableau source, make sure we only auto-move the bottom-most card if sending to foundation
    const targetDest = findSmartDestination(
      card,
      state.tableau,
      state.foundations
    );

    if (targetDest) {
      return state.executeMove(source, targetDest);
    }
    return false;
  },

  // Undo last player move
  undo: () => {
    const { history, isWon } = get();
    if (history.length === 0 || isWon) return false;

    const previousSnapshot = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);

    set({
      tableau: previousSnapshot.tableau,
      foundations: previousSnapshot.foundations,
      stock: previousSnapshot.stock,
      waste: previousSnapshot.waste,
      score: previousSnapshot.score,
      moves: previousSnapshot.moves,
      history: newHistory,
      selectedCard: null,
      isWon: false,
    });
    return true;
  },

  // Auto-complete step (animates or finishes winning boards automatically)
  autoCompleteStep: () => {
    const state = get();
    if (state.isWon) return false;

    // Look for lowest card in tableau that can move to foundation
    for (let col = 0; col < state.tableau.length; col++) {
      const column = state.tableau[col];
      if (column.length === 0) continue;
      const topCard = column[column.length - 1];

      if (canPlaceOnFoundation(topCard, topCard.suit, state.foundations[topCard.suit])) {
        return state.executeMove(
          { type: 'tableau', colIndex: col, cardIndex: column.length - 1 },
          { type: 'foundation', suit: topCard.suit }
        );
      }
    }

    return false;
  },

  // Timer tick
  tickTimer: () => {
    const { timerActive, isWon, timeElapsed } = get();
    if (timerActive && !isWon) {
      set({ timeElapsed: timeElapsed + 1 });
    }
  },

  pauseTimer: () => set({ timerActive: false }),
  resumeTimer: () => set({ timerActive: true }),
}));
