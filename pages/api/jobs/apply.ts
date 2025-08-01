import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma'; // ✅ Named import

// Disable Next.js built-in body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public/uploads');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ error: 'Form parsing failed' });
    }

    try {
      // ✅ Safely extract string values
      const jobIdStr = Array.isArray(fields.jobId) ? fields.jobId[0] : fields.jobId;
      const userIdStr = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;

      const jobId = parseInt(jobIdStr || '', 10);
      const userId = parseInt(userIdStr || '', 10);

      if (!jobId || !userId) {
        return res.status(400).json({ error: 'Missing jobId or userId' });
      }

      // ✅ Ensure resume file exists and is valid
      const resumeFile = Array.isArray(files.resume) ? files.resume[0] : files.resume;
      if (!resumeFile || !resumeFile.filepath) {
        return res.status(400).json({ error: 'Resume file is required' });
      }

      // ✅ Prevent duplicate application
      const existing = await prisma.jobApplication.findUnique({
        where: {
          userId_jobId: {
            userId,
            jobId,
          },
        },
      });

      if (existing) {
        return res.status(400).json({ error: 'You have already applied for this job' });
      }

      const resumeFilename = path.basename(resumeFile.filepath);
      const resumePath = `/uploads/${resumeFilename}`;

      await prisma.jobApplication.create({
        data: {
          jobId,
          userId,
          resume: resumePath,
        },
      });

      return res.status(200).json({ message: 'Application submitted successfully' });
    } catch (e) {
      console.error('Application error:', e);
      return res.status(500).json({ error: 'Something went wrong during application' });
    }
  });
}
