import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { jobId } = req.query;
  const userId = 1;

  if (!jobId) {
    return res.status(400).json({ message: 'Missing jobId' });
  }

  try {
    const application = await prisma.jobApplication.findFirst({
      where: {
        jobId: Number(jobId),
        userId: userId,
      },
    });

    if (!application) {
      return res.status(404).json({ message: 'No application found for this job' });
    }

    return res.status(200).json({ status: application.status });
  } catch (error) {
    console.error('Error fetching application status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
