import { useState } from 'react';
import axios from 'axios';

const ads = [
  { id: 1, title: "Ad 1", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 2, title: "Ad 2", videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0" },
  { id: 3, title: "Ad 3", videoUrl: "https://www.youtube.com/embed/3JZ_D3ELwOQ" },
];

export default function AdsPage() {
  const [activeAdId, setActiveAdId] = useState<number | null>(null);
  const [watchTimers, setWatchTimers] = useState<{ [key: number]: number }>({});
  const [watched, setWatched] = useState<{ [key: number]: boolean }>({});
  const [rewarded, setRewarded] = useState<{ [key: number]: boolean }>({});

  const startWatching = (adId: number) => {
    if (activeAdId === adId || rewarded[adId]) return;

    setActiveAdId(adId);
    setWatchTimers((prev) => ({ ...prev, [adId]: 15 }));

    const timer = setInterval(() => {
      setWatchTimers((prev) => {
        const current = prev[adId] || 0;
        if (current <= 1) {
          clearInterval(timer);
          setWatched((prevWatched) => ({ ...prevWatched, [adId]: true }));
          return { ...prev, [adId]: 0 };
        }
        return { ...prev, [adId]: current - 1 };
      });
    }, 1000);
  };

  const claimReward = async (adId: number) => {
    try {
      const res = await axios.post(
        "/api/reward/ad",
        { adId },
        {
          withCredentials: true, 
        }
      );
      if (res.status === 200) {
        setRewarded((prev) => ({ ...prev, [adId]: true }));
        alert(`Reward for Ad ${adId} claimed!`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Error claiming reward");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 to-black text-white flex flex-col items-center justify-start p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Watch Ads & Earn Coins</h1>
      {ads.map((ad) => (
        <div key={ad.id} className="bg-white/10 p-6 rounded-xl max-w-lg w-full shadow-md space-y-3">
          <h2 className="text-xl font-semibold">{ad.title}</h2>

          <div className="relative aspect-video rounded-md overflow-hidden border border-gray-600">
            <iframe
              className="w-full h-full"
              src={ad.videoUrl}
              title={ad.title}
              allow="autoplay; encrypted-media"
            ></iframe>
            {!watched[ad.id] && !rewarded[ad.id] && (
              <button
                onClick={() => startWatching(ad.id)}
                className="absolute inset-0 bg-black bg-opacity-40 hover:bg-opacity-60 text-white text-lg font-bold flex items-center justify-center"
              >
                Start Watching
              </button>
            )}
          </div>

          <p className="text-center">
            {rewarded[ad.id]
              ? "✅ Reward already claimed!"
              : watched[ad.id]
              ? "⏱ Done watching! Claim your reward below."
              : activeAdId === ad.id
              ? `⏳ Watching... ${watchTimers[ad.id] || 15}s left`
              : ""}
          </p>

          <button
            onClick={() => claimReward(ad.id)}
            disabled={!watched[ad.id] || rewarded[ad.id]}
            className={`w-full py-2 rounded-md font-semibold transition ${
              watched[ad.id] && !rewarded[ad.id]
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            {rewarded[ad.id] ? "Reward Claimed" : "Claim Reward"}
          </button>
        </div>
      ))}
    </main>
  );
}
