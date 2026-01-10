/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `coupon` table. All the data in the column will be lost.
  - You are about to alter the column `deletedAt` on the `course` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `coupon` DROP COLUMN `expiresAt`,
    ADD COLUMN `endsAt` DATETIME(3) NULL,
    ADD COLUMN `startsAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `course` MODIFY `deletedAt` TIMESTAMP NULL;

-- AddForeignKey
ALTER TABLE `CourseView` ADD CONSTRAINT `CourseView_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
