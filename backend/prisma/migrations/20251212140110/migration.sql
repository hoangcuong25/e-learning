/*
  Warnings:

  - You are about to alter the column `deletedAt` on the `course` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- DropForeignKey
ALTER TABLE `courseview` DROP FOREIGN KEY `CourseView_courseId_fkey`;

-- DropIndex
DROP INDEX `CourseView_courseId_userId_ipAddress_key` ON `courseview`;

-- AlterTable
ALTER TABLE `course` MODIFY `deletedAt` TIMESTAMP NULL;

-- CreateTable
CREATE TABLE `InstructorProfile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `bio` TEXT NULL,
    `experience` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `InstructorProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InstructorProfile` ADD CONSTRAINT `InstructorProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

