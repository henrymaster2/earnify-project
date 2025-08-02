/*
  Warnings:

  - A unique constraint covering the columns `[sessionCode]` on the table `CheckersGame` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionCode` to the `CheckersGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CheckersGame" ADD COLUMN     "sessionCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CheckersGame_sessionCode_key" ON "CheckersGame"("sessionCode");
