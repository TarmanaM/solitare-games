'use client';

import { Box, Typography } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import Card from './Card';
import { useSolitaireStore } from '@/store/useSolitaireStore';

// Renders the Stock (draw pile) and Waste (revealed pile)
export default function StockWaste() {
  const stock = useSolitaireStore((state) => state.stock);
  const waste = useSolitaireStore((state) => state.waste);
  const drawCards = useSolitaireStore((state) => state.drawCards);
  const selectedCard = useSolitaireStore((state) => state.selectedCard);
  const handleCardClick = useSolitaireStore((state) => state.handleCardClick);
  const smartMove = useSolitaireStore((state) => state.smartMove);
  const setDraggedSource = useSolitaireStore((state) => state.setDraggedSource);
  const clearDraggedSource = useSolitaireStore(
    (state) => state.clearDraggedSource
  );
  const draggedSource = useSolitaireStore((state) => state.draggedSource);

  const topWasteCard = waste.length > 0 ? waste[waste.length - 1] : null;
  const isWasteSelected =
    selectedCard?.source?.type === 'waste' &&
    selectedCard?.card?.id === topWasteCard?.id;
  const isWasteDragging = draggedSource?.type === 'waste';

  return (
    <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
      {/* Stock Pile */}
      <Box
        onClick={drawCards}
        sx={{
          width: { xs: 44, sm: 68, md: 84 },
          height: { xs: 62, sm: 96, md: 120 },
          borderRadius: { xs: '5px', sm: '8px' },
          border: '1.5px dashed rgba(255, 255, 255, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s ease',
          backgroundColor:
            stock.length === 0
              ? 'rgba(0, 0, 0, 0.15)'
              : 'transparent',
          '&:hover': {
            borderColor: '#e5b869',
            backgroundColor: 'rgba(229, 184, 105, 0.08)',
          },
        }}
      >
        {stock.length > 0 ? (
          <>
            <Card card={stock[stock.length - 1]} />
            <Box
              sx={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                color: '#f8fafc',
                fontSize: { xs: '0.6rem', sm: '0.75rem' },
                fontWeight: 700,
                borderRadius: '10px',
                px: 0.75,
                py: 0.1,
                pointerEvents: 'none',
              }}
            >
              {stock.length}
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            <ReplayIcon sx={{ fontSize: { xs: 20, sm: 28 } }} />
            <Typography sx={{ fontSize: { xs: '0.55rem', sm: '0.7rem' }, mt: 0.5 }}>
              Reset
            </Typography>
          </Box>
        )}
      </Box>

      {/* Waste Pile */}
      <Box
        sx={{
          width: { xs: 44, sm: 68, md: 84 },
          height: { xs: 62, sm: 96, md: 120 },
          borderRadius: { xs: '5px', sm: '8px' },
          border: topWasteCard
            ? 'none'
            : '1.5px dashed rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {topWasteCard ? (
          <Card
            card={topWasteCard}
            isSelected={isWasteSelected}
            isDragging={isWasteDragging}
            draggable={true}
            onDragStart={(e) => {
              e.dataTransfer.setData(
                'text/plain',
                JSON.stringify({ type: 'waste' })
              );
              e.dataTransfer.effectAllowed = 'move';
              setDraggedSource({ type: 'waste' });
            }}
            onDragEnd={() => clearDraggedSource()}
            onClick={() =>
              handleCardClick(topWasteCard, { type: 'waste' })
            }
            onDoubleClick={() =>
              smartMove(topWasteCard, { type: 'waste' })
            }
          />
        ) : (
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.15)',
              fontSize: { xs: '0.7rem', sm: '0.85rem' },
            }}
          >
            Empty
          </Typography>
        )}
      </Box>
    </Box>
  );
}
