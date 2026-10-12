'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HistoryIcon from '@mui/icons-material/History';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { useQuery } from '@tanstack/react-query';

// Format seconds into MM:SS
const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

export default function LeaderboardModal({ open, onClose }) {
  const [tabIndex, setTabIndex] = useState(0);

  // TanStack Query to fetch leaderboard data
  const { data, isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await fetch('/api/game/leaderboard');
      if (!res.ok) throw new Error('Failed to load leaderboard');
      return res.json();
    },
    enabled: open,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#0a2018',
          border: '1px solid rgba(229, 184, 105, 0.4)',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#e5b869',
          fontWeight: 700,
        }}
      >
        <EmojiEventsIcon sx={{ color: '#e5b869' }} />
        Leaderboard & Game Statistics
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Top Summary Stats */}
        {data?.stats && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
              mb: 3,
            }}
          >
            <Paper
              sx={{
                p: 1.5,
                textAlign: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Total Played
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                {data.stats.totalGames}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 1.5,
                textAlign: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Total Victories
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#34d399' }}>
                {data.stats.totalWins}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 1.5,
                textAlign: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Win Rate
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#e5b869' }}>
                {data.stats.winRate}%
              </Typography>
            </Paper>
          </Box>
        )}

        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <Tab
            label="High Scores"
            icon={<EmojiEventsIcon />}
            iconPosition="start"
          />
          <Tab
            label="Recent Matches"
            icon={<HistoryIcon />}
            iconPosition="start"
          />
        </Tabs>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: 'center', py: 4 }}>
            Could not retrieve leaderboard records.
          </Typography>
        ) : tabIndex === 0 ? (
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#e5b869', fontWeight: 700 }}>
                    #
                  </TableCell>
                  <TableCell sx={{ color: '#e5b869', fontWeight: 700 }}>
                    Player
                  </TableCell>
                  <TableCell sx={{ color: '#e5b869', fontWeight: 700 }} align="right">
                    Score
                  </TableCell>
                  <TableCell sx={{ color: '#e5b869', fontWeight: 700 }} align="right">
                    Moves
                  </TableCell>
                  <TableCell sx={{ color: '#e5b869', fontWeight: 700 }} align="right">
                    Time
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.topScores?.length > 0 ? (
                  data.topScores.map((record, index) => (
                    <TableRow key={record.id}>
                      <TableCell sx={{ color: '#94a3b8' }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: '#f8fafc', fontWeight: 600 }}>
                        {record.playerName}
                      </TableCell>
                      <TableCell
                        sx={{ color: '#e5b869', fontWeight: 700 }}
                        align="right"
                      >
                        {record.score}
                      </TableCell>
                      <TableCell sx={{ color: '#f8fafc' }} align="right">
                        {record.moves}
                      </TableCell>
                      <TableCell sx={{ color: '#60a5fa' }} align="right">
                        {formatTime(record.timeElapsedInSeconds)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ color: '#94a3b8', py: 3 }}
                    >
                      No recorded victories yet. Complete a game to appear here!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#e5b869', fontWeight: 700 }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: '#e5b869', fontWeight: 700 }}>
                    Player
                  </TableCell>
                  <TableCell sx={{ color: '#e5b869', fontWeight: 700 }} align="right">
                    Score
                  </TableCell>
                  <TableCell sx={{ color: '#e5b869', fontWeight: 700 }} align="right">
                    Moves
                  </TableCell>
                  <TableCell sx={{ color: '#e5b869', fontWeight: 700 }} align="right">
                    Time
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.recentGames?.length > 0 ? (
                  data.recentGames.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Chip
                          size="small"
                          label={record.won ? 'Won' : 'Ended'}
                          color={record.won ? 'success' : 'default'}
                          sx={{ fontSize: '0.65rem' }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#f8fafc' }}>
                        {record.playerName}
                      </TableCell>
                      <TableCell
                        sx={{ color: '#e5b869', fontWeight: 700 }}
                        align="right"
                      >
                        {record.score}
                      </TableCell>
                      <TableCell sx={{ color: '#f8fafc' }} align="right">
                        {record.moves}
                      </TableCell>
                      <TableCell sx={{ color: '#60a5fa' }} align="right">
                        {formatTime(record.timeElapsedInSeconds)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ color: '#94a3b8', py: 3 }}
                    >
                      No game history found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
