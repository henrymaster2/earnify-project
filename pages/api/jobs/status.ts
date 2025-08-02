// pages/api/jobs/status.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Missing email' });
    }

    const applications = await prisma.jobApplication.findMany({
      where: {
        user: {
          email: email,
        },
      },
      select: {
        jobId: true,
      },
    });

    return res.status(200).json({ applications });
  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
}
