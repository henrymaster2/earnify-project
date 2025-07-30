import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    if (decoded.email !== 'masitahenry4@gmail.com') {
      return res.status(403).json({ error: 'Forbidden - Admins only' });
    }

    const applications = await prisma.jobApplication.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        job: {
          select: {
            title: true,
            company: true,
          },
        },
      },
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
