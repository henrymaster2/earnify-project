/*
  Warnings:

  - You are about to drop the column `email` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `JobApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
