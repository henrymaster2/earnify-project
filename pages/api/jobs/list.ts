import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const jobs = await prisma.jobAd.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
      },
    });

    res.status(200).json({ jobs });
  } catch (error) {
    console.error('Error fetching job list:', error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
}
