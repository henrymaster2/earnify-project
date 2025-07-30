/*
  Warnings:

  - A unique constraint covering the columns `[userId,adId]` on the table `AdWatch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adId` to the `AdWatch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdWatch" ADD COLUMN     "adId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AdWatch_userId_adId_key" ON "AdWatch"("userId", "adId");
