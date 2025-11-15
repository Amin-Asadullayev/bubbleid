import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';

export async function GET(request, {params}) {
  try {
    const param = await params;
    const snap = await get(ref(db, `bubbles`))
    const allBubbles = Object.entries(snap.val() || {}).map(([id, bubble]) => ({
      id,
      ...bubble
    }));
    const users = allBubbles.filter(b => b.userID === param.userId);
    return NextResponse.json(users, { status: 200 });
    } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}