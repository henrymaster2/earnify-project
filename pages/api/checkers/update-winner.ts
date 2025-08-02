import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = await getToken({ req, secret });

  if (!token || !token.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { sessionCode, winnerId } = req.body;

  if (!sessionCode || !winnerId) {
    return res.status(400).json({ error: "Session code and winnerId are required" });
  }

  try {
    const game = await prisma.checkersGame.findUnique({
      where: { sessionCode },
    });

    if (!game || game.status !== "active") {
      return res.status(400).json({ error: "Invalid or inactive game session" });
    }

    const totalWager = game.wagerAmount * 2;
    const serviceFee = Math.floor(totalWager * 0.2);
    const prize = totalWager - serviceFee;

    await prisma.checkersGame.update({
      where: { sessionCode },
      data: {
        status: "completed",
        winnerId,
        fee: serviceFee,
        prize,
      },
    });

    await prisma.user.update({
      where: { id: winnerId },
      data: {
        coins: {
          increment: prize,
        },
      },
    });

    res.status(200).json({ message: "Winner updated and prize distributed." });
  } catch (error) {
    console.error("Failed to update winner:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
