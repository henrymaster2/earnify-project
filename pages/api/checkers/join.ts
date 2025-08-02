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

  const { sessionCode } = req.body;

  if (!sessionCode || typeof sessionCode !== "string") {
    return res.status(400).json({ error: "Session code is required" });
  }

  try {
    const game = await prisma.checkersGame.findUnique({
      where: { sessionCode },
    });

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    if (game.player2Id) {
      return res.status(400).json({ error: "Game already has a second player" });
    }

    if (game.player1Id === token.id) {
      return res.status(400).json({ error: "You cannot join your own game" });
    }

    const player2 = await prisma.user.findUnique({
      where: { id: token.id as number },
    });

    if (!player2 || player2.coins < game.wagerAmount) {
      return res.status(400).json({ error: "Insufficient coins to join the game" });
    }

    await prisma.checkersGame.update({
      where: { sessionCode },
      data: {
        player2Id: player2.id,
        status: "active",
      },
    });

    await prisma.user.update({
      where: { id: player2.id },
      data: {
        coins: {
          decrement: game.wagerAmount,
        },
      },
    });

    res.status(200).json({ message: "Joined game successfully" });
  } catch (error) {
    console.error("Error joining game:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
