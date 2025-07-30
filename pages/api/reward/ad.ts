// pages/api/reward/ad.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const rawCookies = req.headers.cookie || '';
    const parsedCookies = parse(rawCookies);

    const token = parsedCookies.token;
    if (!token) return res.status(401).json({ error: 'No token found' });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { coins: { increment: 5 } },
    });

    return res.status(200).json({ message: 'Rewarded', coins: user.coins });
  } catch (error: any) {
    console.error('Ad reward error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
