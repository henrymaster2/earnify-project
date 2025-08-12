// pages/api/checkers/create.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { wagerAmount } = req.body;

  if (!wagerAmount || isNaN(wagerAmount) || wagerAmount <= 0) {
    return res.status(400).json({ message: "Invalid wager amount" });
  }

  const fee = Math.floor(wagerAmount * 0.2);
  const prize = wagerAmount * 2 - fee;

  const sessionCode = nanoid(6).toUpperCase(); // e.g. AB12CD

  try {
    const game = await prisma.checkersGame.create({
      data: {
        sessionCode,
        player1Id: Number(session.user.id),
        wagerAmount,
        fee,
        prize,
        status: "waiting",
      },
    });

    return res.status(200).json({ sessionCode });
  } catch (error) {
    console.error("Game creation failed:", error);
    return res.status(500).json({ message: "Failed to create game" });
  }
}