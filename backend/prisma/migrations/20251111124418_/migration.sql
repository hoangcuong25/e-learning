/*
  Warnings:

  - Made the column `userId` on table `courseview` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `courseview` DROP FOREIGN KEY `CourseView_userId_fkey`;

-- DropIndex
DROP INDEX `CourseView_userId_fkey` ON `courseview`;

-- AlterTable
ALTER TABLE `courseview` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `CourseView` ADD CONSTRAINT `CourseView_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
