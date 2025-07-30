import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'myearnifysecretkey';

type Props = {
  id: number;
  name: string;
  coins: number;
};

export default function Dashboard({ id, name, coins }: Props) {
  const referralLink = `http://localhost:3000/signup?ref=${id}`;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white">
      
      <nav className="bg-blue-800 text-white py-4 shadow-md">
        <div className="px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Earnify Dashboard</h1>
          <div className="space-x-6 font-semibold">
            <Link href="/dashboard" className="hover:underline">Home</Link>
            <Link href="/" className="hover:underline text-red-400">Logout</Link>
          </div>
        </div>
      </nav>

      
      <div className="text-center mt-20 px-4">
        <h2 className="text-4xl font-bold mb-2">Welcome, {name}</h2>
        <p className="text-xl mb-6">Your Coin Balance: <span className="font-semibold">{coins}</span></p>

        
        <div className="flex flex-col gap-4 items-center">
          <Link
            href="/jobs/search"
            className="bg-blue-700 hover:bg-blue-600 px-8 py-3 rounded-xl font-semibold shadow-lg w-full max-w-xs text-center"
          >
            🔍 View Available Jobs
          </Link>

          <Link
            href="/jobs/post"
            className="bg-green-700 hover:bg-green-600 px-8 py-3 rounded-xl font-semibold shadow-lg w-full max-w-xs text-center"
          >
            📤 Post a Job
          </Link>

          <Link
            href="/games"
            className="bg-purple-700 hover:bg-purple-600 px-8 py-3 rounded-xl font-semibold shadow-lg w-full max-w-xs text-center"
          >
            🎮 Play Games
          </Link>

          
          <Link
            href="/ads"
            className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-semibold shadow-lg w-full max-w-xs text-center"
          >
            📺 Watch Ads and Earn
          </Link>
        </div>

    
        <div className="mt-12 text-center px-4">
          <p className="text-lg mb-2">Your referral link:</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
            <code className="bg-gray-800 px-4 py-2 rounded-md break-all">{referralLink}</code>
            <button
              onClick={copyToClipboard}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md mt-2 sm:mt-0"
            >
              Copy
            </button>
          </div>
          {copied && <p className="text-sm mt-2 text-green-400">Copied!</p>}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = context.req.headers.cookie;
    if (!cookies) throw new Error('No cookies found');

    const { token } = cookie.parse(cookies);
    if (!token) throw new Error('No token found');

    const decoded: any = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        coins: true,
      },
    });

    if (!user) throw new Error('User not found');

    return {
      props: {
        id: user.id,
        name: user.name,
        coins: user.coins ?? 0,
      },
    };
  } catch (error) {
    console.error('Dashboard access error:', error);

    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};
