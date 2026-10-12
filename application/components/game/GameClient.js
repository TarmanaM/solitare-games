"use client";

import { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import Header from "@/components/ui/Header";
import Board from "@/components/game/Board";
import LeaderboardModal from "@/components/ui/LeaderboardModal";
import WinModal from "@/components/ui/WinModal";
import NotificationSnackbar from "@/components/ui/NotificationSnackbar";
import SseListener from "@/components/game/SseListener";
import { useSolitaireStore } from "@/store/useSolitaireStore";

// Main interactive Client Component orchestrating the Solitaire UI and flow
export default function GameClient() {
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const startNewGame = useSolitaireStore((state) => state.startNewGame);
  const stock = useSolitaireStore((state) => state.stock);
  const tableau = useSolitaireStore((state) => state.tableau);

  // Initialize new game if board is empty on initial mount
  useEffect(() => {
    if (stock.length === 0 && tableau[0].length === 0) {
      startNewGame();
    }
  }, [startNewGame, stock.length, tableau]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(circle at 50% 20%, #164e3c 0%, #0d3126 50%, #061a14 100%)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Background Felt Texture Effect */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #061a14 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 12px 12px",
        }}
      />

      {/* Top Application Header */}
      <Header onOpenLeaderboard={() => setLeaderboardOpen(true)} />

      {/* Solitaire Table Surface */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          py: { xs: 1.5, sm: 3 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Board />
      </Container>

      <LeaderboardModal
        open={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
      />
      <WinModal />
      <NotificationSnackbar />
      <SseListener />
    </Box>
  );
}
