/*
  Warnings:

  - The primary key for the `CheckersGame` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `coinWager` on the `CheckersGame` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CheckersGame` table. All the data in the column will be lost.
  - The `id` column on the `CheckersGame` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `player2Id` column on the `CheckersGame` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `winnerId` column on the `CheckersGame` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `wagerAmount` to the `CheckersGame` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `player1Id` on the `CheckersGame` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CheckersGame" DROP CONSTRAINT "CheckersGame_player1Id_fkey";

-- DropForeignKey
ALTER TABLE "CheckersGame" DROP CONSTRAINT "CheckersGame_player2Id_fkey";

-- DropForeignKey
ALTER TABLE "CheckersGame" DROP CONSTRAINT "CheckersGame_winnerId_fkey";

-- AlterTable
ALTER TABLE "CheckersGame" DROP CONSTRAINT "CheckersGame_pkey",
DROP COLUMN "coinWager",
DROP COLUMN "updatedAt",
ADD COLUMN     "fee" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "prize" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wagerAmount" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "player1Id",
ADD COLUMN     "player1Id" INTEGER NOT NULL,
DROP COLUMN "player2Id",
ADD COLUMN     "player2Id" INTEGER,
DROP COLUMN "winnerId",
ADD COLUMN     "winnerId" INTEGER,
ADD CONSTRAINT "CheckersGame_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "referrerId" INTEGER,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "AdWatch" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdWatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,
    "resumeUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdWatch" ADD CONSTRAINT "AdWatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckersGame" ADD CONSTRAINT "CheckersGame_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckersGame" ADD CONSTRAINT "CheckersGame_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckersGame" ADD CONSTRAINT "CheckersGame_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
