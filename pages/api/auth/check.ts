import { NextApiRequest, NextApiResponse } from 'next';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'myearnifysecretkey';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) return res.status(401).end();

    const { token } = cookie.parse(cookies);
    if (!token) return res.status(401).end();

    jwt.verify(token, JWT_SECRET);
    return res.status(200).end();
  } catch (err) {
    return res.status(401).end();
  }
}
