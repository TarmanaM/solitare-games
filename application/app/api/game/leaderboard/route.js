import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Fetch leaderboard and game history
export async function GET() {
  try {
    const topScores = await prisma.gameRecord.findMany({
      where: { won: true },
      orderBy: [{ score: 'desc' }, { timeElapsedInSeconds: 'asc' }],
      take: 10,
    });

    const recentGames = await prisma.gameRecord.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const totalGames = await prisma.gameRecord.count();
    const totalWins = await prisma.gameRecord.count({
      where: { won: true },
    });

    return NextResponse.json({
      success: true,
      topScores,
      recentGames,
      stats: {
        totalGames,
        totalWins,
        winRate: totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}
