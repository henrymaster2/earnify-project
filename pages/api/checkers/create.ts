import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

const secret = process.env.NEXTAUTH_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Request received:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const token = await getToken({ req, secret });
    console.log("Token:", token);

    if (!token || !token.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = parseInt(token.sub as string);
    console.log("User ID:", userId);

    const { amount } = req.body;
    console.log("Wager amount received:", amount);

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid wager amount" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.coins < amount) {
      return res.status(400).json({ message: "Insufficient coins" });
    }

    const fee = Math.floor(amount * 0.2);
    const prize = amount - fee;
    const sessionCode = uuidv4().split("-")[0];

    const newGame = await prisma.checkersGame.create({
      data: {
        sessionCode,
        player1Id: userId,
        wagerAmount: amount,
        fee,
        prize,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { coins: { decrement: amount } },
    });

    console.log("Game created:", newGame);

    return res.status(200).json({
      message: "Game created",
      game: newGame,
    });
  } catch (error) {
    console.error("Create game error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
