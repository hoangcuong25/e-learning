-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullname` VARCHAR(50) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `avatar` VARCHAR(191) NOT NULL DEFAULT 'https://res.cloudinary.com/dtaawt3ej/image/upload/v1747292486/q9lmgugyqgrm7q5voatw.jpg',
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NULL,
    `dob` DATE NULL,
    `address` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN', 'INSTRUCTOR') NOT NULL DEFAULT 'USER',
    `phone` VARCHAR(191) NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `resetOtp` VARCHAR(191) NULL,
    `resetOtpExpires` DATETIME(3) NULL,
    `verificationOtp` VARCHAR(191) NULL,
    `verificationOtpExpires` DATETIME(3) NULL,
    `refreshToken` TEXT NULL,
    `refreshTokenExpires` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InstructorApplication` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `experience` TEXT NULL,
    `bio` TEXT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `reviewedAt` DATETIME(3) NULL,
    `reviewedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Specialization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `desc` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Specialization_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationSpecializations` (
    `applicationId` INTEGER NOT NULL,
    `specializationId` INTEGER NOT NULL,

    PRIMARY KEY (`applicationId`, `specializationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InstructorApplication` ADD CONSTRAINT `InstructorApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationSpecializations` ADD CONSTRAINT `ApplicationSpecializations_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `InstructorApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationSpecializations` ADD CONSTRAINT `ApplicationSpecializations_specializationId_fkey` FOREIGN KEY (`specializationId`) REFERENCES `Specialization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
