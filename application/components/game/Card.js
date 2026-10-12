'use client';

import { Box, Typography } from '@mui/material';

// Renders an individual playing card with pure text and suit icons
export default function Card({
  card,
  isSelected = false,
  isDragging = false,
  draggable = false,
  onClick,
  onDoubleClick,
  onDragStart,
  onDragEnd,
  customSx = {},
}) {
  if (!card) return null;

  const isFaceUp = card.isFaceUp;
  const isRed = card.color === 'red';
  const textColor = isRed ? '#dc2626' : '#1e293b';

  if (!isFaceUp) {
    return (
      <Box
        onClick={onClick}
        sx={{
          width: { xs: 44, sm: 68, md: 84 },
          height: { xs: 62, sm: 96, md: 120 },
          borderRadius: { xs: '5px', sm: '8px' },
          background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: onClick ? 'pointer' : 'default',
          userSelect: 'none',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          '&:hover': onClick
            ? {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 14px rgba(0, 0, 0, 0.45)',
              }
            : {},
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: { xs: 2, sm: 4 },
            border: '1px dashed rgba(255, 255, 255, 0.2)',
            borderRadius: { xs: '3px', sm: '5px' },
          },
          ...customSx,
        }}
      >
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.3)',
            fontSize: { xs: '0.8rem', sm: '1.2rem', md: '1.5rem' },
            fontWeight: 700,
          }}
        >
          ♠
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      draggable={isFaceUp && Boolean(draggable)}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sx={{
        width: { xs: 44, sm: 68, md: 84 },
        height: { xs: 62, sm: 96, md: 120 },
        borderRadius: { xs: '5px', sm: '8px' },
        backgroundColor: '#ffffff',
        border: isSelected
          ? '2px solid #e5b869'
          : '1px solid rgba(0, 0, 0, 0.15)',
        boxShadow: isSelected
          ? '0 0 14px rgba(229, 184, 105, 0.85), 0 4px 10px rgba(0,0,0,0.3)'
          : '0 3px 6px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: { xs: '2px 4px', sm: '4px 6px', md: '6px 8px' },
        cursor: isFaceUp && draggable ? 'grab' : 'pointer',
        userSelect: 'none',
        position: 'relative',
        color: textColor,
        opacity: isDragging ? 0.35 : 1,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
        transform: isSelected ? 'translateY(-4px)' : 'none',
        '&:active': isFaceUp && draggable ? { cursor: 'grabbing' } : {},
        '&:hover': {
          transform: isSelected ? 'translateY(-4px)' : 'translateY(-2px)',
          boxShadow: isSelected
            ? '0 0 16px rgba(229, 184, 105, 1)'
            : '0 6px 12px rgba(0, 0, 0, 0.35)',
        },
        ...customSx,
      }}
    >
      {/* Top Left Rank & Symbol */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: 1,
          width: 'fit-content',
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '0.7rem', sm: '0.95rem', md: '1.1rem' },
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {card.label}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '0.65rem', sm: '0.85rem', md: '1rem' },
            lineHeight: 1,
          }}
        >
          {card.symbol}
        </Typography>
      </Box>

      {/* Center Suit Icon */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '1.2rem', sm: '1.8rem', md: '2.4rem' },
            lineHeight: 1,
            opacity: 0.9,
          }}
        >
          {card.symbol}
        </Typography>
      </Box>

      {/* Bottom Right Inverted Rank & Symbol */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: 1,
          alignSelf: 'flex-end',
          transform: 'rotate(180deg)',
          width: 'fit-content',
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '0.7rem', sm: '0.95rem', md: '1.1rem' },
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {card.label}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '0.65rem', sm: '0.85rem', md: '1rem' },
            lineHeight: 1,
          }}
        >
          {card.symbol}
        </Typography>
      </Box>
    </Box>
  );
}
