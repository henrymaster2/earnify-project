// pages/api/admin/applications.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const applications = await prisma.jobApplication.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        job: true,
      },
    });

    return res.status(200).json(applications);
  }

  if (req.method === 'PUT') {
    const { id, status } = req.body;

    console.log('Incoming PUT request:', { id, status });

    if (!id || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    try {
      const updated = await prisma.jobApplication.update({
        where: { id: Number(id) },
        data: { status },
      });

      return res.status(200).json(updated);
    } catch (err) {
      console.error('Update error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
