import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import {
  FaHome,
  FaBriefcase,
  FaGift,
  FaGamepad,
  FaComments,
  FaUserCircle,
  FaMoneyBillWave,
  FaCoins,
} from 'react-icons/fa';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'myearnifysecretkey';

type Props = {
  id: number;
  name: string;
  coins: number;
  profilePic?: string | null;
};

export default function Dashboard({ id, name, coins, profilePic }: Props) {
  const [copied, setCopied] = useState(false);
  const profileImageSrc =
    profilePic && profilePic.trim() !== '' ? profilePic : '/profile.png';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-800 text-white py-4 shadow-md hidden md:flex justify-between items-center px-6">
        <div className="flex items-center gap-4">
          <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
              <Image
                src={profileImageSrc}
                alt="Profile Picture"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="font-semibold truncate max-w-[150px]">{name || 'User'}</span>
          </Link>
          <h1 className="text-2xl font-bold">Earnify Dashboard</h1>
        </div>
        <div className="flex gap-6 font-semibold">
          <Link href="/dashboard" className="hover:underline">Home</Link>
          <Link href="/profile" className="hover:underline">Profile</Link>
          <Link href="/" className="hover:underline text-red-400">Logout</Link>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 text-center mt-10 px-4 pb-20 md:pb-4">
        <h2 className="text-4xl font-bold mb-6">Welcome, {name || 'User'}</h2>

        {/* Coin Balance */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg flex flex-col items-center w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Your Coin Balance</h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl font-bold text-yellow-400">{coins ?? 0}</span>
              <FaCoins className="text-yellow-400" size={28} />
            </div>
            <div className="flex gap-4">
              <Link
                href="/finance/deposit"
                className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold shadow-md transition"
              >
                💰 Deposit
              </Link>
              <Link
                href="/finance/withdraw"
                className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold shadow-md transition"
              >
                🏦 Withdraw
              </Link>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex flex-col gap-4 items-center">
          {[
            { href: '/jobs', text: <><FaBriefcase /> Jobs</>, bg: 'bg-blue-700 hover:bg-blue-600', flex: true },
            { href: '/finance', text: <><FaMoneyBillWave /> Finance</>, bg: 'bg-yellow-600 hover:bg-yellow-500', flex: true },
            { href: '/earn', text: <><FaGift /> Earn</>, bg: 'bg-indigo-600 hover:bg-indigo-500', flex: true },
            { href: '/chat', text: <><FaComments /> Chat with Friends</>, bg: 'bg-pink-700 hover:bg-pink-600', flex: true },
          ].map(({ href, text, bg, flex }, idx) => (
            <Link
              key={idx}
              href={href}
              className={`${bg} px-8 py-3 rounded-xl font-semibold shadow-lg w-full max-w-xs text-center transition flex items-center justify-center ${flex ? 'gap-2' : ''}`}
            >
              {text}
            </Link>
          ))}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-blue-950 border-t border-blue-800 shadow-lg">
        <div className="flex justify-around py-2 text-sm">
          {[
            { href: '/dashboard', icon: <FaHome size={20} />, label: 'Home' },
            { href: '/jobs', icon: <FaBriefcase size={20} />, label: 'Jobs' },
            { href: '/finance', icon: <FaMoneyBillWave size={20} />, label: 'Finance' },
            { href: '/earn', icon: <FaGift size={20} />, label: 'Earn' },
            { href: '/chat', icon: <FaComments size={20} />, label: 'Chat' },
            { href: '/profile', icon: <FaUserCircle size={20} />, label: 'Profile' },
          ].map(({ href, icon, label }, idx) => (
            <Link key={idx} href={href} className="flex flex-col items-center hover:text-blue-300 transition">
              {icon}
              {label}
            </Link>
          ))}
        </div>
      </nav>
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
      select: { id: true, name: true, coins: true, profilePic: true },
    });

    if (!user) throw new Error('User not found');

    return {
      props: {
        id: user.id,
        name: user.name || '',
        coins: user.coins ?? 0,
        profilePic: user.profilePic ?? null,
      },
    };
  } catch (error) {
    console.error('Dashboard access error:', error);
    return { redirect: { destination: '/login', permanent: false } };
  }
};
