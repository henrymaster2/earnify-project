// lib/auth.ts

import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret';

export function getToken(req: NextApiRequest) {
  try {
    const token = req.cookies.token;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return null;
  }
}
