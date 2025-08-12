import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile } from 'formidable';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { PrismaClient } from '@prisma/client';

export const config = { api: { bodyParser: false } };

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'myearnifysecretkey';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const cookies = req.headers.cookie;
    if (!cookies) return res.status(401).json({ error: 'No cookies found' });

    const { token } = cookie.parse(cookies);
    if (!token) return res.status(401).json({ error: 'No token found' });

    const decoded: any = jwt.verify(token, JWT_SECRET);

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const form = formidable({ multiples: false, uploadDir, keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'File upload error' });

      const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!uploadedFile) return res.status(400).json({ error: 'No file uploaded' });

      const fileData = uploadedFile as FormidableFile;
      const relativePath = '/uploads/' + path.basename(fileData.filepath);

      await prisma.user.update({
        where: { id: decoded.userId },
        data: { profilePic: relativePath },
      });

      return res.status(200).json({ message: 'Profile picture updated', path: relativePath });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
