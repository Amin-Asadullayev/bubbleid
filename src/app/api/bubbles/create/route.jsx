import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { ref, set } from 'firebase/database';

function randomString(length) {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const id = randomString(16);
    const data = {
        balance: 0,
        status: "active",
        createdAt: Date.now(),
        lastActivity: Date.now(),
        userID: body.userID
    }
    set(ref(db, `bubbles/${id}`), data)

    const responseData = { 
        id: id,
        balance: 0,
        status: "active"
     };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}