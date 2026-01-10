/*
  Warnings:

  - You are about to alter the column `deletedAt` on the `course` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the `coursereport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `coursereport` DROP FOREIGN KEY `CourseReport_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `coursereport` DROP FOREIGN KEY `CourseReport_userId_fkey`;

-- AlterTable
ALTER TABLE `course` MODIFY `deletedAt` TIMESTAMP NULL;

-- DropTable
DROP TABLE `coursereport`;

-- CreateTable
CREATE TABLE `Report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reporterId` INTEGER NOT NULL,
    `targetType` ENUM('POST', 'POST_COMMENT', 'COURSE', 'USER') NOT NULL,
    `targetId` INTEGER NOT NULL,
    `reason` ENUM('SPAM', 'HARASSMENT', 'HATE_SPEECH', 'VIOLENCE', 'NUDITY', 'OTHER') NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('PENDING', 'REVIEWED', 'REJECTED', 'ACTION_TAKEN') NOT NULL DEFAULT 'PENDING',
    `reviewedBy` INTEGER NULL,
    `reviewedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Report_targetType_targetId_idx`(`targetType`, `targetId`),
    INDEX `Report_status_idx`(`status`),
    UNIQUE INDEX `Report_reporterId_targetType_targetId_key`(`reporterId`, `targetType`, `targetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
