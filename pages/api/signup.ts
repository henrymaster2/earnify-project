import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password, referrerId } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        referrerId: referrerId ? Number(referrerId) : undefined,
      },
    });

    if (referrerId) {
      await prisma.user.update({
        where: { id: Number(referrerId) },
        data: {
          coins: { increment: 20 },
        },
      });
    }

    return res.status(200).json({ message: 'User created', userId: newUser.id });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      message: 'Signup failed',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
