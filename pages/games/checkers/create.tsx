// pages/games/checkers/create.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function CreateGamePage() {
  const [coins, setCoins] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCreateGame = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/checkers/create", { coins });
      const { sessionCode } = response.data;

      router.push(`/games/checkers/play/${sessionCode}`);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create game");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Create a Checkers Game</h1>
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md">
        <label className="block mb-2 text-lg font-semibold">Enter Coin Wager:</label>
        <input
          type="number"
          value={coins}
          onChange={(e) => setCoins(Number(e.target.value))}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none mb-4"
          min={1}
        />
        <button
          onClick={handleCreateGame}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 w-full py-2 rounded font-semibold transition"
        >
          {loading ? "Creating..." : "Create Game"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
