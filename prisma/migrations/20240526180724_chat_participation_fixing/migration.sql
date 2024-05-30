/*
  Warnings:

  - You are about to drop the `_UserChats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserChats" DROP CONSTRAINT "_UserChats_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserChats" DROP CONSTRAINT "_UserChats_B_fkey";

-- DropTable
DROP TABLE "_UserChats";

-- CreateTable
CREATE TABLE "_ChatParticipate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChatParticipate_AB_unique" ON "_ChatParticipate"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatParticipate_B_index" ON "_ChatParticipate"("B");

-- AddForeignKey
ALTER TABLE "_ChatParticipate" ADD CONSTRAINT "_ChatParticipate_A_fkey" FOREIGN KEY ("A") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatParticipate" ADD CONSTRAINT "_ChatParticipate_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
