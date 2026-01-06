-- AlterTable
ALTER TABLE `transaction` MODIFY `type` ENUM('COURSE_PURCHASE', 'COURSE_REFUND', 'ADMIN_ADJUST', 'DEPOSIT', 'WITHDRAW', 'REWARD') NOT NULL;

-- CreateTable
CREATE TABLE `InstructorEarning` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `instructorId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `type` ENUM('COURSE_PURCHASE', 'COURSE_REFUND', 'ADMIN_ADJUST', 'DEPOSIT', 'WITHDRAW', 'REWARD') NOT NULL,
    `transactionId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseDailyStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `courseId` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `views` INTEGER NOT NULL,
    `enrollments` INTEGER NOT NULL,
    `revenue` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InstructorDailyStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `instructorId` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `totalViews` INTEGER NOT NULL,
    `totalEnrollments` INTEGER NOT NULL,
    `totalRevenue` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `CourseView_courseId_viewedAt_idx` ON `CourseView`(`courseId`, `viewedAt`);

-- CreateIndex
CREATE INDEX `Transaction_userId_createdAt_idx` ON `Transaction`(`userId`, `createdAt`);

-- AddForeignKey
ALTER TABLE `InstructorEarning` ADD CONSTRAINT `InstructorEarning_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstructorEarning` ADD CONSTRAINT `InstructorEarning_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseDailyStats` ADD CONSTRAINT `CourseDailyStats_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstructorDailyStats` ADD CONSTRAINT `InstructorDailyStats_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
