import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'myearnifysecretkey';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookies = req.headers.cookie;
    if (!cookies) return res.status(401).json({ error: 'No cookies found' });

    const { token } = cookie.parse(cookies);
    if (!token) return res.status(401).json({ error: 'No token found' });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const { phone } = req.body;

    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { phone },
    });

    return res.status(200).json({ message: 'Phone number updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
