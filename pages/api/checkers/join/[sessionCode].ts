// pages/api/checkers/join/[sessionCode].ts
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { sessionCode } = req.query;

  if (typeof sessionCode !== "string") {
    return res.status(400).json({ message: "Invalid session code" });
  }

  const game = await prisma.checkersGame.findUnique({
    where: { sessionCode },
  });

  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  if (game.player2Id) {
    return res.status(400).json({ message: "Game already has two players" });
  }

  if (Number(session.user.id) === game.player1Id) {
    return res.status(400).json({ message: "You cannot join your own game" });
  }

  const updatedGame = await prisma.checkersGame.update({
    where: { sessionCode },
    data: {
      player2Id: Number(session.user.id),
      status: "active",
    },
  });

  return res.status(200).json({ message: "Joined successfully" });
}
