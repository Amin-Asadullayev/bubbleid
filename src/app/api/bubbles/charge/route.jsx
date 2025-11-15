import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { ref, set, get } from 'firebase/database';

export async function POST(request) {
    try {
        const body = await request.json();
        const snap = await get(ref(db, `bubbles/${body.id}`))
        if (snap.exists() && snap.val().status == "active") {
            let balance = snap.val().balance;
            const amount = body.amount
            if (balance < body.amount) { return NextResponse.json({ success: false, error: "insufficient_balance" }) }
            set(ref(db, `bubbles/${body.id}/balance`), balance - body.amount)
            let ledgerRef = ref(db, `ledger/${body.id}/${Date.now()}`)
            await set(ledgerRef, {
                type: "debit",
                amount,
                balanceAfter: balance - body.amount,
                timestamp: Date.now()
            });
            if (balance - body.amount == 0){
                set(ref(db, `bubbles/${body.id}/status`), "inactive")
            }


            return NextResponse.json({ "success": true, "newBalace": balance - body.amount }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Invalid id!" }, { status: 405 })
        }
    } catch (error) {
        console.error('Error handling POST request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}