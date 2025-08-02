import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

const WaitingRoom = () => {
  const router = useRouter();
  const { sessionCode } = router.query;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof sessionCode === 'string') {
      navigator.clipboard.writeText(sessionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStartGame = () => {
    if (typeof sessionCode === 'string') {
      router.push(`/games/checkers/play/${sessionCode}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white px-4">
      <h1 className="text-4xl font-bold mb-6">Waiting Room</h1>

      {typeof sessionCode === 'string' ? (
        <>
          <p className="mb-2 text-lg">Session Code:</p>
          <div className="flex items-center space-x-3 bg-gray-800 px-4 py-2 rounded-lg mb-4">
            <span className="text-xl font-mono">{sessionCode}</span>
            <button onClick={handleCopy} className="hover:text-green-400">
              <Copy size={20} />
              {copied && <span className="ml-2 text-sm">Copied!</span>}
            </button>
          </div>

          <Button
            onClick={handleStartGame}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Start Game
          </Button>
        </>
      ) : (
        <p className="text-lg">Loading session code...</p>
      )}
    </div>
  );
};

export default WaitingRoom;
