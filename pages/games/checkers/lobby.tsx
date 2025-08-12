import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function CheckersLobby() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [wager, setWager] = useState(0);
  const [sessionCode, setSessionCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const handleCreateMatch = async () => {
    setIsCreating(true);
    setError("");

    try {
      const res = await axios.post("/api/checkers/create", {
        wager,
      });

      const { sessionCode } = res.data;
      setSessionCode(sessionCode);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create game.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinMatch = async () => {
    setIsJoining(true);
    setError("");

    try {
      const res = await axios.post("/api/checkers/join", {
        sessionCode: joinCode.trim(),
      });

      router.push(`/games/checkers/play/${joinCode.trim()}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to join game.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white px-4">
      <h1 className="text-4xl font-bold mb-6">Checkers Game Lobby</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Create a Game</h2>
        <input
          type="number"
          placeholder="Enter wager amount"
          value={wager}
          onChange={(e) => setWager(Number(e.target.value))}
          className="w-full p-2 rounded mb-4 bg-gray-700 border border-gray-600 text-white"
        />
        <button
          onClick={handleCreateMatch}
          disabled={isCreating}
          className="w-full bg-blue-600 hover:bg-blue-700 transition rounded p-2 font-semibold"
        >
          {isCreating ? "Creating..." : "Create Game"}
        </button>

        {sessionCode && (
          <div className="mt-4 text-center">
            <p className="text-green-400">Session Code:</p>
            <p className="text-xl font-bold">{sessionCode}</p>
            <p className="text-sm mt-2 text-gray-400">Share this code with your opponent</p>
          </div>
        )}
      </div>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Join a Game</h2>
        <input
          type="text"
          placeholder="Enter session code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          className="w-full p-2 rounded mb-4 bg-gray-700 border border-gray-600 text-white"
        />
        <button
          onClick={handleJoinMatch}
          disabled={isJoining}
          className="w-full bg-green-600 hover:bg-green-700 transition rounded p-2 font-semibold"
        >
          {isJoining ? "Joining..." : "Join Game"}
        </button>
      </div>
    </div>
  );
}
