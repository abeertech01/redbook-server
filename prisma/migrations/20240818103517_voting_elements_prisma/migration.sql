/*
  Warnings:

  - You are about to drop the column `downvote` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `upvote` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "downvote",
DROP COLUMN "upvote",
ADD COLUMN     "downvoteIds" TEXT[],
ADD COLUMN     "upvoteIds" TEXT[];
