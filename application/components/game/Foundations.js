'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Card from './Card';
import { FOUNDATION_SUITS, SUIT_SYMBOLS, SUIT_COLORS } from '@/lib/solitaire/constants';
import { useSolitaireStore } from '@/store/useSolitaireStore';

// Renders the 4 Foundation piles (Hearts, Diamonds, Clubs, Spades)
export default function Foundations() {
  const [dragOverSuit, setDragOverSuit] = useState(null);

  const foundations = useSolitaireStore((state) => state.foundations);
  const selectedCard = useSolitaireStore((state) => state.selectedCard);
  const draggedSource = useSolitaireStore((state) => state.draggedSource);
  const setDraggedSource = useSolitaireStore((state) => state.setDraggedSource);
  const clearDraggedSource = useSolitaireStore(
    (state) => state.clearDraggedSource
  );
  const executeMove = useSolitaireStore((state) => state.executeMove);
  const handleDestinationClick = useSolitaireStore(
    (state) => state.handleDestinationClick
  );
  const handleCardClick = useSolitaireStore((state) => state.handleCardClick);
  const smartMove = useSolitaireStore((state) => state.smartMove);

  return (
    <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
      {FOUNDATION_SUITS.map((suit) => {
        const pile = foundations[suit] || [];
        const topCard = pile.length > 0 ? pile[pile.length - 1] : null;
        const symbol = SUIT_SYMBOLS[suit];
        const isRed = SUIT_COLORS[suit] === 'red';
        const isSelected =
          selectedCard?.source?.type === 'foundation' &&
          selectedCard?.source?.suit === suit;
        const isDraggingThis =
          draggedSource?.type === 'foundation' &&
          draggedSource?.suit === suit;
        const isOver = dragOverSuit === suit;

        return (
          <Box
            key={suit}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDragEnter={() => setDragOverSuit(suit)}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setDragOverSuit(null);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverSuit(null);
              let source = draggedSource;
              if (!source) {
                try {
                  const raw = e.dataTransfer.getData('text/plain');
                  if (raw) source = JSON.parse(raw);
                } catch {}
              }
              if (source) {
                executeMove(source, { type: 'foundation', suit });
              }
              clearDraggedSource();
            }}
            onClick={() => {
              if (selectedCard) {
                handleDestinationClick({ type: 'foundation', suit });
              } else if (topCard) {
                handleCardClick(topCard, { type: 'foundation', suit });
              }
            }}
            sx={{
              width: { xs: 44, sm: 68, md: 84 },
              height: { xs: 62, sm: 96, md: 120 },
              borderRadius: { xs: '5px', sm: '8px' },
              border: isOver
                ? '2px solid #e5b869'
                : topCard
                ? 'none'
                : '1.5px dashed rgba(255, 255, 255, 0.25)',
              boxShadow: isOver
                ? '0 0 14px rgba(229, 184, 105, 0.8)'
                : 'none',
              transform: isOver ? 'scale(1.03)' : 'none',
              backgroundColor: isOver
                ? 'rgba(229, 184, 105, 0.15)'
                : 'rgba(0, 0, 0, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.15s ease',
              '&:hover': {
                borderColor: '#e5b869',
                backgroundColor: 'rgba(229, 184, 105, 0.08)',
              },
            }}
          >
            {topCard ? (
              <Card
                card={topCard}
                isSelected={isSelected}
                isDragging={isDraggingThis}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    'text/plain',
                    JSON.stringify({ type: 'foundation', suit })
                  );
                  e.dataTransfer.effectAllowed = 'move';
                  setDraggedSource({ type: 'foundation', suit });
                }}
                onDragEnd={() => clearDraggedSource()}
                onDoubleClick={() =>
                  smartMove(topCard, { type: 'foundation', suit })
                }
              />
            ) : (
              <Typography
                sx={{
                  color: isRed
                    ? 'rgba(239, 68, 68, 0.25)'
                    : 'rgba(255, 255, 255, 0.2)',
                  fontSize: { xs: '1.2rem', sm: '1.8rem', md: '2.4rem' },
                  lineHeight: 1,
                  userSelect: 'none',
                }}
              >
                {symbol}
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
