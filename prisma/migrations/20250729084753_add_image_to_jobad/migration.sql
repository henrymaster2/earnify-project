/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `JobAd` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobAd" DROP COLUMN "imageUrl",
ADD COLUMN     "imageBase64" TEXT;
