import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { NextApiRequest } from "next";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret"; // Make sure to set this in .env

// This function decodes the token from cookies and fetches the full user from the DB
export async function getUserFromToken(req: NextApiRequest) {
  try {
    const token = req.cookies?.token;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    return user; // Includes full user data like id, coins, email, etc.
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// Optional helper to create a JWT token for a user
export function generateToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}
