/*
  Warnings:

  - You are about to drop the column `downvote` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `upvote` on the `comments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "downvote",
DROP COLUMN "upvote",
ADD COLUMN     "downvoteIds" TEXT[],
ADD COLUMN     "upvoteIds" TEXT[];
