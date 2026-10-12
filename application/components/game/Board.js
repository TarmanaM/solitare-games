'use client';

import { Box, Button } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import StockWaste from './StockWaste';
import Foundations from './Foundations';
import Tableau from './Tableau';
import { useSolitaireStore } from '@/store/useSolitaireStore';

// Main Solitaire playing board
export default function Board() {
  const isAutoCompletePossible = useSolitaireStore(
    (state) => state.isAutoCompletePossible
  );
  const isWon = useSolitaireStore((state) => state.isWon);
  const autoCompleteStep = useSolitaireStore((state) => state.autoCompleteStep);

  const runAutoComplete = () => {
    const interval = setInterval(() => {
      const moved = autoCompleteStep();
      if (!moved) clearInterval(interval);
    }, 120);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 960,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Top Section: Stock, Waste, and Foundations */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          px: { xs: 1, sm: 2 },
          pt: { xs: 1, sm: 2 },
        }}
      >
        <StockWaste />
        <Foundations />
      </Box>

      {/* Auto-Complete Quick Action Banner */}
      {isAutoCompletePossible && !isWon && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AutoFixHighIcon />}
            onClick={runAutoComplete}
            sx={{
              boxShadow: '0 0 15px rgba(229, 184, 105, 0.6)',
              animation: 'pulse 1.5s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.04)' },
                '100%': { transform: 'scale(1)' },
              },
            }}
          >
            Auto-Complete Available!
          </Button>
        </Box>
      )}

      {/* Bottom Section: Tableau Columns */}
      <Tableau />
    </Box>
  );
}
