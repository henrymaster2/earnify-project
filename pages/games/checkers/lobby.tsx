import { useState } from "react";
import axios from "axios";

export default function CheckersLobby() {
  const [wager, setWager] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [status, setStatus] = useState("");

  const handleCreate = async () => {
    setStatus("Creating game...");
    try {
      const res = await axios.post("/api/checkers/create", { wagerAmount: Number(wager) });
      setSessionCode(res.data.sessionCode);
      setStatus("✅ Game created! Share this code with your opponent:");
    } catch (err: any) {
      setStatus("❌ Failed to create game: " + err.response?.data?.error || "Unknown error");
    }
  };

  const handleJoin = async () => {
    setStatus("Joining game...");
    try {
      const res = await axios.post("/api/checkers/join", { sessionCode: joinCode });
      setStatus("✅ Successfully joined the game!");
    } catch (err: any) {
      setStatus("❌ Failed to join game: " + err.response?.data?.error || "Unknown error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">Checkers Game Lobby</h1>

      <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">🎮 Create Game</h2>
        <input
          type="number"
          placeholder="Enter wager amount"
          value={wager}
          onChange={(e) => setWager(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white outline-none"
        />
        <button
          onClick={handleCreate}
          className="bg-green-600 hover:bg-green-700 w-full p-3 rounded font-bold"
        >
          Create Game
        </button>

        {sessionCode && (
          <div className="mt-4 bg-gray-800 p-4 rounded text-center">
            <p>{status}</p>
            <code className="block text-xl mt-2">{sessionCode}</code>
          </div>
        )}
      </div>

      <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-lg mt-8">
        <h2 className="text-2xl font-semibold mb-4">🤝 Join Game</h2>
        <input
          type="text"
          placeholder="Enter session code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white outline-none"
        />
        <button
          onClick={handleJoin}
          className="bg-blue-600 hover:bg-blue-700 w-full p-3 rounded font-bold"
        >
          Join Game
        </button>
      </div>

      {status && !sessionCode && (
        <div className="mt-6 text-center">
          <p>{status}</p>
        </div>
      )}
    </div>
  );
}
