-- CreateIndex
CREATE INDEX `Enrollment_userId_idx` ON `Enrollment`(`userId`);

-- RenameIndex
ALTER TABLE `enrollment` RENAME INDEX `Enrollment_courseId_fkey` TO `Enrollment_courseId_idx`;
