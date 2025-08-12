/*
  Warnings:

  - The primary key for the `CheckersGame` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fee` on the `CheckersGame` table. All the data in the column will be lost.
  - You are about to drop the column `prize` on the `CheckersGame` table. All the data in the column will be lost.
  - You are about to drop the column `wagerAmount` on the `CheckersGame` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `referrerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AdWatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobApplication` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `coinWager` to the `CheckersGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CheckersGame` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdWatch" DROP CONSTRAINT "AdWatch_userId_fkey";

-- DropForeignKey
ALTER TABLE "CheckersGame" DROP CONSTRAINT "CheckersGame_player1Id_fkey";

-- DropForeignKey
ALTER TABLE "CheckersGame" DROP CONSTRAINT "CheckersGame_player2Id_fkey";

-- DropForeignKey
ALTER TABLE "CheckersGame" DROP CONSTRAINT "CheckersGame_winnerId_fkey";

-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_jobId_fkey";

-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_referrerId_fkey";

-- AlterTable
ALTER TABLE "CheckersGame" DROP CONSTRAINT "CheckersGame_pkey",
DROP COLUMN "fee",
DROP COLUMN "prize",
DROP COLUMN "wagerAmount",
ADD COLUMN     "coinWager" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "player1Id" SET DATA TYPE TEXT,
ALTER COLUMN "player2Id" SET DATA TYPE TEXT,
ALTER COLUMN "winnerId" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "CheckersGame_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CheckersGame_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "isAdmin",
DROP COLUMN "referrerId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "AdWatch";

-- DropTable
DROP TABLE "Job";

-- DropTable
DROP TABLE "JobApplication";

-- AddForeignKey
ALTER TABLE "CheckersGame" ADD CONSTRAINT "CheckersGame_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckersGame" ADD CONSTRAINT "CheckersGame_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckersGame" ADD CONSTRAINT "CheckersGame_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
