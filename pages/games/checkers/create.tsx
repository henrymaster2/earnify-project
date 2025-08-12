// pages/games/checkers/create.tsx
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";

export default function CreateCheckersMatch() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [wagerAmount, setWagerAmount] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [error, setError] = useState("");

  const handleCreateMatch = async () => {
    setError("");
    setSessionCode("");

    const wager = parseInt(wagerAmount, 10);
    if (isNaN(wager) || wager <= 0) {
      setError("Please enter a valid wager amount.");
      return;
    }

    try {
      const res = await axios.post("/api/checkers/create", {
        wagerAmount: wager,
      });

      if (res.data.sessionCode) {
        setSessionCode(res.data.sessionCode);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create match.");
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") {
    return <p className="text-center text-white p-4">Please log in to create a match.</p>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-950 via-slate-900 to-blue-900 text-white p-4">
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Checkers Match</h1>

        <input
          type="number"
          placeholder="Enter wager amount"
          value={wagerAmount}
          onChange={(e) => setWagerAmount(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-white/10 text-white rounded-md placeholder-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleCreateMatch}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded-md font-semibold text-white"
        >
          Create Match
        </button>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        {sessionCode && (
          <div className="mt-6 text-center">
            <p className="text-green-400 font-medium">Match Created!</p>
            <p className="mt-1 text-sm">
              Share this code with your opponent:
            </p>
            <div className="text-xl font-bold mt-2">{sessionCode}</div>

            <button
              className="mt-4 text-blue-300 hover:underline text-sm"
              onClick={() => router.push(`/games/checkers/play/${sessionCode}`)}
            >
              Go to game board →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}