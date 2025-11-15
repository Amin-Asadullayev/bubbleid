import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { ref, get, remove } from 'firebase/database';

export async function GET(request, {params}) {
  try {
    const param = await params;
    console.log(param.bubbleId)
    const snap = await get(ref(db, `bubbles/${param.bubbleId}`))
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

export async function DELETE(request, {params}){
    try{
        const param = await params;
        const snap = await get(ref(db, `bubbles/${param.bubbleId}`))
    if (snap.exists()){
        remove(ref(db, `bubbles/${param.bubbleId}`))
        return NextResponse.json({ status: 200 });
    } else {
        return NextResponse.json({error: "Invalid id!"}, {status: 405})
    }
    } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}