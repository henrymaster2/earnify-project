import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, jobId } = req.body;

    if (!email || !jobId) {
      return res.status(400).json({ message: 'Missing email or jobId' });
    }

    const existing = await prisma.jobApplication.findFirst({
      where: {
        jobId: Number(jobId),
        user: {
          email: email,
        },
      },
      include: {
        user: true,
      },
    });

    if (!existing) {
      return res.status(200).json({ status: 'Not Applied' });
    }

    return res.status(200).json({ status: existing.status });
  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
}
