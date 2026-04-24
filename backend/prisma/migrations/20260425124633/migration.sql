/*
  Warnings:

  - You are about to alter the column `deletedAt` on the `course` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `course` MODIFY `deletedAt` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `avatar` VARCHAR(191) NOT NULL DEFAULT 'https://res.cloudinary.com/dzfansbci/image/upload/v1777120766/avatar-elearning_yhpmjb.png';
