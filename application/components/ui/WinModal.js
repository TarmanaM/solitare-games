'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import confetti from 'canvas-confetti';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useQueryClient } from '@tanstack/react-query';
import { useSolitaireStore } from '@/store/useSolitaireStore';

// Format seconds to MM:SS
const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

export default function WinModal() {
  const isWon = useSolitaireStore((state) => state.isWon);
  const score = useSolitaireStore((state) => state.score);
  const moves = useSolitaireStore((state) => state.moves);
  const timeElapsed = useSolitaireStore((state) => state.timeElapsed);
  const startNewGame = useSolitaireStore((state) => state.startNewGame);
  const showNotification = useSolitaireStore((state) => state.showNotification);

  const [playerName, setPlayerName] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const queryClient = useQueryClient();

  // Fire festive confetti on victory
  useEffect(() => {
    if (isWon) {
      setIsSaved(false);
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.error('Confetti error:', err);
      }
    }
  }, [isWon]);

  const handleSaveScore = async () => {
    if (isSaving || isSaved) return;
    setIsSaving(true);
    try {
      const response = await fetch('/api/game/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score,
          moves,
          timeElapsedInSeconds: timeElapsed,
          won: true,
          playerName: playerName || 'Anonymous Champion',
        }),
      });

      if (!response.ok) throw new Error('Save failed');

      setIsSaved(true);
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      showNotification('Victory record saved to leaderboard!', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Failed to save victory record', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isWon) return null;

  return (
    <Dialog
      open={isWon}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#0a2018',
          border: '2px solid #e5b869',
          borderRadius: 3,
          textAlign: 'center',
          boxShadow: '0 0 30px rgba(229, 184, 105, 0.4)',
        },
      }}
    >
      <DialogTitle sx={{ pt: 3 }}>
        <EmojiEventsIcon sx={{ fontSize: 56, color: '#e5b869', mb: 1 }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(45deg, #f5d799 30%, #e5b869 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Congratulations!
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
          You have successfully cleared Solitaire!
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Victory Metrics */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            py: 1.5,
            px: 1,
            borderRadius: 2,
            my: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Final Score
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#e5b869' }}>
              {score}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Total Moves
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
              {moves}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Time
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#60a5fa' }}>
              {formatTime(timeElapsed)}
            </Typography>
          </Box>
        </Box>

        {/* Player Name Form */}
        {!isSaved ? (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Your Name for Leaderboard"
              variant="outlined"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="e.g. Master Ace"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSaveScore}
              disabled={isSaving}
              sx={{ mt: 1.5, fontWeight: 700 }}
            >
              {isSaving ? 'Saving...' : 'Submit to Leaderboard'}
            </Button>
          </Box>
        ) : (
          <Typography
            sx={{
              color: '#34d399',
              fontWeight: 600,
              fontSize: '0.9rem',
              my: 2,
            }}
          >
            ✓ Your score has been entered into the records!
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button
          onClick={startNewGame}
          variant="outlined"
          sx={{
            borderColor: '#e5b869',
            color: '#e5b869',
            '&:hover': {
              borderColor: '#f5d799',
              backgroundColor: 'rgba(229, 184, 105, 0.1)',
            },
          }}
        >
          Play Again
        </Button>
      </DialogActions>
    </Dialog>
  );
}
