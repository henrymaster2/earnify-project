/*
  Warnings:

  - Added the required column `updatedAt` to the `CheckersGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CheckersGame" ADD COLUMN     "boardState" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "currentTurn" TEXT NOT NULL DEFAULT 'player1',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
