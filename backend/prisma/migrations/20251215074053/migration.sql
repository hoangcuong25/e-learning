/*
  Warnings:

  - You are about to alter the column `deletedAt` on the `course` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `course` MODIFY `deletedAt` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `report` MODIFY `reason` ENUM('SPAM', 'INAPPROPRIATE_CONTENT', 'HARASSMENT', 'HATE_SPEECH', 'VIOLENCE', 'NUDITY', 'OTHER') NOT NULL;
