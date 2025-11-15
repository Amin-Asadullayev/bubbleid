"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

export default function BubblePurchaseSimulator() {
  const [bubbleId, setBubbleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const PURCHASE_AMOUNT = 12.99;

  const handlePurchase = async (e) => {
    e.preventDefault();

    if (!bubbleId) {
      setError("Please enter a Bubble ID.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/bubbles/charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: bubbleId,
          amount: PURCHASE_AMOUNT,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Purchase failed.");
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Purchase simulation
        </h1>

        <form className="space-y-4" onSubmit={handlePurchase}>
          <div className="space-y-1">
            <label htmlFor="bubbleId" className="text-sm text-zinc-400">
              Bubble ID
            </label>
            <input
              id="bubbleId"
              type="text"
              value={bubbleId}
              onChange={(e) => setBubbleId(e.target.value)}
              placeholder="Enter Bubble ID"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </div>

          <div className="text-md text-zinc-400">
            Amount: <span className="text-white">${PURCHASE_AMOUNT}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Confirm Purchase"}
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-xl text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4 bg-green-500/20 border border-green-500 text-green-400 px-4 py-2 rounded-xl text-sm">
            Purchase successful! <br />
            New Balance: ${result.newBalace.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}
