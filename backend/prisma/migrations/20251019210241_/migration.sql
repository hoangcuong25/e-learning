-- DropForeignKey
ALTER TABLE `quiz` DROP FOREIGN KEY `Quiz_lessonId_fkey`;

-- DropIndex
DROP INDEX `Quiz_lessonId_key` ON `quiz`;

-- AddForeignKey
-- ALTER TABLE `Option` ADD CONSTRAINT `Option_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
