import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function GamesPage() {
  const [glowTitle, setGlowTitle] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setGlowTitle((prev) => !prev), 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black text-white p-6 font-sans">
      {/* Header */}
      <div className="text-center mb-12">
        <h1
          className={`text-4xl md:text-5xl font-extrabold tracking-wide mb-2 transition-all duration-1000 ${
            glowTitle ? 'text-purple-400 drop-shadow-neon' : 'text-blue-300 drop-shadow-glow'
          }`}
        >
          🎮 WELCOME TO THE EARNIFY ARCADE
        </h1>
        <p className="text-lg text-gray-300 mt-2">
          Choose a game below and earn rewards while having fun!
        </p>
      </div>

      {/* Game Options */}
      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {/* Checkers */}
        <Link
          href="/games/checkers/lobby"
          className="bg-black bg-opacity-30 backdrop-blur-md border border-red-600 rounded-2xl p-6 shadow-xl hover:scale-105 transition-transform hover:shadow-red-500/70 group"
        >
          <div className="text-center">
            <div className="text-6xl mb-4 group-hover:animate-bounce">🕹️</div>
            <h2 className="text-2xl font-bold mb-2 text-red-400 group-hover:text-white drop-shadow-neon">
              Checkers
            </h2>
            <p className="text-gray-300">Outsmart your opponent in this classic 2-player board game.</p>
          </div>
        </Link>

        {/* Chess */}
        <Link
          href="/games/chess"
          className="bg-black bg-opacity-30 backdrop-blur-md border border-yellow-500 rounded-2xl p-6 shadow-xl hover:scale-105 transition-transform hover:shadow-yellow-400/70 group"
        >
          <div className="text-center">
            <div className="text-6xl mb-4 group-hover:animate-spin">♟️</div>
            <h2 className="text-2xl font-bold mb-2 text-yellow-400 group-hover:text-white drop-shadow-neon">
              Chess
            </h2>
            <p className="text-gray-300">Play the king of board games. Strategy is key to win and earn!</p>
          </div>
        </Link>

        {/* Spin Wheel */}
        <Link
          href="/games/spin"
          className="bg-black bg-opacity-30 backdrop-blur-md border border-purple-600 rounded-2xl p-6 shadow-xl hover:scale-105 transition-transform hover:shadow-purple-500/70 group"
        >
          <div className="text-center">
            <div className="text-6xl mb-4 animate-spin-slow">🎡</div>
            <h2 className="text-2xl font-bold mb-2 text-purple-400 group-hover:text-white drop-shadow-neon">
              Spin the Wheel
            </h2>
            <p className="text-gray-300">Try your luck! Win coin rewards by spinning the magic wheel.</p>
          </div>
        </Link>
      </div>

      {/* Back Link */}
      <div className="text-center mt-16">
        <Link href="/dashboard" className="text-blue-400 hover:underline font-semibold">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Custom Tailwind Animations */}
      <style jsx>{`
        .drop-shadow-neon {
          text-shadow: 0 0 5px #fff, 0 0 10px #8a2be2, 0 0 20px #8a2be2;
        }
        .drop-shadow-glow {
          text-shadow: 0 0 5px #4f46e5, 0 0 10px #60a5fa, 0 0 20px #60a5fa;
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
