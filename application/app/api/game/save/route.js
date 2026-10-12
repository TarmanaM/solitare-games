import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { broadcastSseEvent } from '@/lib/sse';

// Save a completed game record
export async function POST(request) {
  try {
    const body = await request.json();
    const { score, moves, timeElapsedInSeconds, won, playerName } = body;

    const record = await prisma.gameRecord.create({
      data: {
        score: Number(score) || 0,
        moves: Number(moves) || 0,
        timeElapsedInSeconds: Number(timeElapsedInSeconds) || 0,
        won: Boolean(won),
        playerName: playerName?.trim() || 'Anonymous Player',
        completedAt: won ? new Date() : null,
      },
    });

    // Notify connected SSE clients of the newly recorded game
    broadcastSseEvent('game_completed', {
      id: record.id,
      score: record.score,
      moves: record.moves,
      timeElapsedInSeconds: record.timeElapsedInSeconds,
      won: record.won,
      playerName: record.playerName,
      createdAt: record.createdAt,
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Error saving game record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save game record' },
      { status: 500 }
    );
  }
}
