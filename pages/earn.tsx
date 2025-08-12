// pages/earn.tsx
import Link from 'next/link';
import { FaVideo, FaGamepad } from 'react-icons/fa';

export default function Earn() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center p-6">
      {/* Header */}
      <h1 className="text-4xl font-bold mt-8 mb-6">Choose How You Want to Earn</h1>
      <p className="text-lg text-gray-300 mb-12 text-center max-w-md">
        Select one of the options below to start earning rewards. You can watch ads or play games — your choice!
      </p>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Watch Ads */}
        <Link
          href="/ads"
          className="bg-blue-700 p-8 rounded-2xl flex flex-col items-center shadow-lg transition transform hover:scale-105 hover:shadow-[0_0_25px_rgba(59,130,246,0.8)]"
        >
          <FaVideo size={60} className="mb-4 text-yellow-300 drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]" />
          <h2 className="text-2xl font-semibold mb-2">Watch Ads</h2>
          <p className="text-gray-300 text-center">
            Watch short ads and get rewarded with coins instantly.
          </p>
        </Link>

        {/* Play Games */}
        <Link
          href="/games"
          className="bg-green-700 p-8 rounded-2xl flex flex-col items-center shadow-lg transition transform hover:scale-105 hover:shadow-[0_0_25px_rgba(34,197,94,0.8)]"
        >
          <FaGamepad size={60} className="mb-4 text-pink-300 drop-shadow-[0_0_10px_rgba(255,105,180,0.8)]" />
          <h2 className="text-2xl font-semibold mb-2">Play Games</h2>
          <p className="text-gray-300 text-center">
            Play fun and exciting games to earn coins while having a good time.
          </p>
        </Link>
      </div>

      {/* Back to Dashboard */}
      <Link
        href="/dashboard"
        className="mt-12 text-blue-400 hover:underline text-lg"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
