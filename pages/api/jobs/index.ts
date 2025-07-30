import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const jobs = await prisma.jobAd.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(jobs);
    }

    if (req.method === 'POST') {
      const { title, description, company, location, imageBase64 } = req.body;

      if (!title || !description || !company || !location) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newJob = await prisma.jobAd.create({
        data: {
          title,
          description,
          company,
          location,
          imageBase64, 
        },
      });

      return res.status(201).json(newJob);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Job API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
