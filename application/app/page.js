import GameClient from '@/components/game/GameClient';

// Server-side page shell (Server Component)
export default async function HomePage() {
  // Server-side logic or data prefetching can be plugged here if required
  return (
    <main>
      <GameClient />
    </main>
  );
}
