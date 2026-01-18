-- DropForeignKey
ALTER TABLE `applicationspecializations` DROP FOREIGN KEY `ApplicationSpecializations_applicationId_fkey`;

-- DropForeignKey
ALTER TABLE `applicationspecializations` DROP FOREIGN KEY `ApplicationSpecializations_specializationId_fkey`;

-- DropForeignKey
ALTER TABLE `instructorapplication` DROP FOREIGN KEY `InstructorApplication_userId_fkey`;

-- DropIndex
DROP INDEX `ApplicationSpecializations_specializationId_fkey` ON `applicationspecializations`;

-- AddForeignKey
ALTER TABLE `InstructorApplication` ADD CONSTRAINT `InstructorApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationSpecializations` ADD CONSTRAINT `ApplicationSpecializations_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `InstructorApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationSpecializations` ADD CONSTRAINT `ApplicationSpecializations_specializationId_fkey` FOREIGN KEY (`specializationId`) REFERENCES `Specialization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
