import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { applicationId, status } = req.body;

  if (
    typeof applicationId !== 'number' ||
    !['verified', 'denied'].includes(status)
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const updated = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
