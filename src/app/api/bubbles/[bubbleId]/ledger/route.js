import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';

export async function GET(request, {params}) {
  try {
    const param = await params;
    const snap = await get(ref(db, `ledger/${param.bubbleId}`))
    if (snap.exists()){
        return NextResponse.json(snap.val(), { status: 200 });
    } else {
        return NextResponse.json({error: "Invalid id!"}, {status: 405})
    }
    } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}