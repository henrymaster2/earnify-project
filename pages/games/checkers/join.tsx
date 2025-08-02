// pages/games/checkers/join.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function JoinCheckersGame() {
  const [sessionCode, setSessionCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleJoin = async () => {
    setError('');

    try {
      const res = await fetch('/api/checkers/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Unable to join game');
        return;
      }

      router.push(`/games/checkers/play/${sessionCode}`);
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Join a Checkers Game</h1>
        <input
          type="text"
          placeholder="Enter session code"
          className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none mb-4"
          value={sessionCode}
          onChange={(e) => setSessionCode(e.target.value)}
        />
        <button
          onClick={handleJoin}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded font-bold transition"
        >
          Join Game
        </button>
        {error && <p className="mt-4 text-red-400 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
}
