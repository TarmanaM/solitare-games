'use client';

import { useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import StarsIcon from '@mui/icons-material/Stars';
import { useSolitaireStore } from '@/store/useSolitaireStore';

// Format elapsed seconds into MM:SS format
const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

export default function Header({ onOpenLeaderboard }) {
  const score = useSolitaireStore((state) => state.score);
  const moves = useSolitaireStore((state) => state.moves);
  const timeElapsed = useSolitaireStore((state) => state.timeElapsed);
  const history = useSolitaireStore((state) => state.history);
  const drawCount = useSolitaireStore((state) => state.drawCount);
  const undo = useSolitaireStore((state) => state.undo);
  const startNewGame = useSolitaireStore((state) => state.startNewGame);
  const setDrawCount = useSolitaireStore((state) => state.setDrawCount);
  const tickTimer = useSolitaireStore((state) => state.tickTimer);

  // Run 1-second interval for game timer
  useEffect(() => {
    const timer = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, [tickTimer]);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'rgba(10, 32, 24, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(229, 184, 105, 0.25)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          gap: 1.5,
          py: 1,
        }}
      >
        {/* Brand Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.08em',
              background: 'linear-gradient(45deg, #f5d799 30%, #e5b869 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.05rem', sm: '1.25rem' },
            }}
          >
            SOLITAIRE
          </Typography>
          <Chip
            size="small"
            label={drawCount === 1 ? 'Draw 1' : 'Draw 3'}
            onClick={() => {
              const newCount = drawCount === 1 ? 3 : 1;
              setDrawCount(newCount);
              startNewGame();
            }}
            sx={{
              backgroundColor: 'rgba(229, 184, 105, 0.15)',
              color: '#f5d799',
              border: '1px solid rgba(229, 184, 105, 0.3)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.7rem',
              '&:hover': {
                backgroundColor: 'rgba(229, 184, 105, 0.3)',
              },
            }}
          />
        </Box>

        {/* Live Metrics: Score, Moves, Time */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 3 },
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            px: { xs: 1.5, sm: 2.5 },
            py: 0.5,
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarsIcon sx={{ color: '#e5b869', fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Score:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: '#f8fafc' }}
            >
              {score}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TouchAppIcon sx={{ color: '#34d399', fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Moves:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: '#f8fafc' }}
            >
              {moves}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TimerIcon sx={{ color: '#60a5fa', fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Time:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: '#f8fafc', fontVariantNumeric: 'tabular-nums' }}
            >
              {formatTime(timeElapsed)}
            </Typography>
          </Box>
        </Box>

        {/* Action Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Undo Last Move">
            <span>
              <Button
                variant="outlined"
                size="small"
                startIcon={<UndoIcon />}
                disabled={history.length === 0}
                onClick={undo}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#f8fafc',
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  '&:hover': {
                    borderColor: '#e5b869',
                    backgroundColor: 'rgba(229, 184, 105, 0.1)',
                  },
                }}
              >
                Undo
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Restart / New Game">
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<RestartAltIcon />}
              onClick={startNewGame}
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                fontWeight: 700,
              }}
            >
              New Game
            </Button>
          </Tooltip>

          <Tooltip title="Leaderboard & Stats">
            <IconButton
              onClick={onOpenLeaderboard}
              sx={{
                color: '#e5b869',
                border: '1px solid rgba(229, 184, 105, 0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(229, 184, 105, 0.15)',
                },
              }}
            >
              <EmojiEventsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
