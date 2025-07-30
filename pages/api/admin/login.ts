import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(403).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(403).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, isAdmin: true }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.setHeader(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
    );

    return res.status(200).json({ message: 'Admin logged in successfully' });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
