import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'myearnifysecretkey';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const { title, description, company, location } = req.body;

    if (!title || !description || !company || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const job = await prisma.jobAd.create({
      data: {
        title,
        description,
        company,
        location,
      },
    });

    return res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    console.error('Job post error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
