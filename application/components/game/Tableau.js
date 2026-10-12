'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Card from './Card';
import { useSolitaireStore } from '@/store/useSolitaireStore';

// Renders the 7 Tableau cascade columns
export default function Tableau() {
  const [dragOverCol, setDragOverCol] = useState(null);

  const tableau = useSolitaireStore((state) => state.tableau);
  const selectedCard = useSolitaireStore((state) => state.selectedCard);
  const draggedSource = useSolitaireStore((state) => state.draggedSource);
  const setDraggedSource = useSolitaireStore((state) => state.setDraggedSource);
  const clearDraggedSource = useSolitaireStore(
    (state) => state.clearDraggedSource
  );
  const executeMove = useSolitaireStore((state) => state.executeMove);
  const handleCardClick = useSolitaireStore((state) => state.handleCardClick);
  const handleDestinationClick = useSolitaireStore(
    (state) => state.handleDestinationClick
  );
  const smartMove = useSolitaireStore((state) => state.smartMove);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: { xs: 0.8, sm: 1.5, md: 2 },
        width: '100%',
        maxWidth: 960,
        margin: '0 auto',
        pt: { xs: 2, sm: 3 },
      }}
    >
      {tableau.map((column, colIndex) => {
        const isEmpty = column.length === 0;
        const isColumnDragOver = dragOverCol === colIndex;

        return (
          <Box
            key={colIndex}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDragEnter={() => setDragOverCol(colIndex)}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setDragOverCol(null);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverCol(null);
              let source = draggedSource;
              if (!source) {
                try {
                  const raw = e.dataTransfer.getData('text/plain');
                  if (raw) source = JSON.parse(raw);
                } catch {}
              }
              if (source) {
                executeMove(source, { type: 'tableau', colIndex });
              }
              clearDraggedSource();
            }}
            onClick={() => {
              if (isEmpty && selectedCard) {
                handleDestinationClick({ type: 'tableau', colIndex });
              }
            }}
            sx={{
              position: 'relative',
              minHeight: { xs: 180, sm: 280, md: 360 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: { xs: '6px', sm: '10px' },
              border: isColumnDragOver
                ? '2px solid #e5b869'
                : '2px solid transparent',
              backgroundColor: isColumnDragOver
                ? 'rgba(229, 184, 105, 0.08)'
                : 'transparent',
              transition: 'all 0.15s ease',
            }}
          >
            {/* Empty column placeholder */}
            {isEmpty && (
              <Box
                sx={{
                  width: { xs: 44, sm: 68, md: 84 },
                  height: { xs: 62, sm: 96, md: 120 },
                  borderRadius: { xs: '5px', sm: '8px' },
                  border: isColumnDragOver
                    ? '2px solid #e5b869'
                    : '1.5px dashed rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: selectedCard ? 'pointer' : 'default',
                  backgroundColor: isColumnDragOver
                    ? 'rgba(229, 184, 105, 0.15)'
                    : 'rgba(0, 0, 0, 0.1)',
                  boxShadow: isColumnDragOver
                    ? '0 0 12px rgba(229, 184, 105, 0.5)'
                    : 'none',
                  transition: 'all 0.15s ease',
                  '&:hover': selectedCard
                    ? {
                        borderColor: '#e5b869',
                        backgroundColor: 'rgba(229, 184, 105, 0.1)',
                      }
                    : {},
                }}
              >
                <Typography
                  sx={{
                    color: isColumnDragOver
                      ? '#e5b869'
                      : 'rgba(255, 255, 255, 0.2)',
                    fontWeight: 700,
                    fontSize: { xs: '0.9rem', sm: '1.3rem' },
                    userSelect: 'none',
                  }}
                >
                  K
                </Typography>
              </Box>
            )}

            {/* Cascade stack of cards */}
            {column.map((card, cardIndex) => {
              // Calculate top offset
              let topPx = 0;
              for (let i = 0; i < cardIndex; i++) {
                topPx += column[i].isFaceUp ? 26 : 14;
              }

              const isThisCardSelected =
                selectedCard?.source?.type === 'tableau' &&
                selectedCard?.source?.colIndex === colIndex &&
                cardIndex >= selectedCard?.source?.cardIndex;

              const isThisCardDragging =
                draggedSource?.type === 'tableau' &&
                draggedSource?.colIndex === colIndex &&
                cardIndex >= draggedSource?.cardIndex;

              return (
                <Box
                  key={card.id || `${colIndex}-${cardIndex}`}
                  sx={{
                    position: 'absolute',
                    top: {
                      xs: topPx * 0.7,
                      sm: topPx,
                      md: topPx * 1.15,
                    },
                    zIndex: cardIndex + 1,
                  }}
                >
                  <Card
                    card={card}
                    isSelected={isThisCardSelected}
                    isDragging={isThisCardDragging}
                    draggable={card.isFaceUp}
                    onDragStart={(e) => {
                      if (!card.isFaceUp) return;
                      e.dataTransfer.setData(
                        'text/plain',
                        JSON.stringify({
                          type: 'tableau',
                          colIndex,
                          cardIndex,
                        })
                      );
                      e.dataTransfer.effectAllowed = 'move';
                      setDraggedSource({
                        type: 'tableau',
                        colIndex,
                        cardIndex,
                      });
                    }}
                    onDragEnd={() => clearDraggedSource()}
                    onClick={() => {
                      if (card.isFaceUp) {
                        handleCardClick(card, {
                          type: 'tableau',
                          colIndex,
                          cardIndex,
                        });
                      }
                    }}
                    onDoubleClick={() => {
                      if (card.isFaceUp) {
                        smartMove(card, {
                          type: 'tableau',
                          colIndex,
                          cardIndex,
                        });
                      }
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
}
