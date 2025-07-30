import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET! });

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const userId = Number(token.id);
  const { jobId, resume } = req.body;
  const numericJobId = Number(jobId);

  const existing = await prisma.jobApplication.findFirst({
    where: { userId, jobId: numericJobId }
  });

  if (existing) return res.status(400).json({ message: 'Already applied' });

  const application = await prisma.jobApplication.create({
    data: {
      userId,
      jobId: numericJobId,
      resume,
      status: 'Pending'
    }
  });

  res.status(200).json({ application });
}
