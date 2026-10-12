'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSolitaireStore } from '@/store/useSolitaireStore';

// Connects to Server-Sent Events stream for real-time game updates
export default function SseListener() {
  const showNotification = useSolitaireStore((state) => state.showNotification);
  const queryClient = useQueryClient();

  useEffect(() => {
    let eventSource = null;

    try {
      eventSource = new EventSource('/api/game/sse');

      eventSource.addEventListener('game_completed', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.won) {
            showNotification(
              `🏆 ${data.playerName} just won with score ${data.score}!`,
              'info'
            );
          }
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        } catch (err) {
          console.error('Error parsing SSE payload:', err);
        }
      });

      eventSource.onerror = () => {
        // EventSource will auto-reconnect
      };
    } catch (err) {
      console.warn('SSE connection error:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [showNotification, queryClient]);

  return null;
}
