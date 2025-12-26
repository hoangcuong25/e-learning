/*
  Warnings:

  - You are about to drop the column `courseId` on the `lesson` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `lesson` DROP FOREIGN KEY `Lesson_courseId_fkey`;

-- DropIndex
DROP INDEX `Lesson_courseId_fkey` ON `lesson`;

-- AlterTable
ALTER TABLE `lesson` DROP COLUMN `courseId`;
