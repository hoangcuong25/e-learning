/*
  Warnings:

  - You are about to drop the column `appliesTo` on the `discountcampaign` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `DiscountCampaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `coupon` ADD COLUMN `specializationId` INTEGER NULL,
    ADD COLUMN `target` ENUM('ALL', 'COURSE', 'SPECIALIZATION') NOT NULL DEFAULT 'ALL';

-- AlterTable
ALTER TABLE `discountcampaign` DROP COLUMN `appliesTo`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `_CouponToDiscountCampaign` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CouponToDiscountCampaign_AB_unique`(`A`, `B`),
    INDEX `_CouponToDiscountCampaign_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Coupon` ADD CONSTRAINT `Coupon_specializationId_fkey` FOREIGN KEY (`specializationId`) REFERENCES `Specialization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouponToDiscountCampaign` ADD CONSTRAINT `_CouponToDiscountCampaign_A_fkey` FOREIGN KEY (`A`) REFERENCES `Coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouponToDiscountCampaign` ADD CONSTRAINT `_CouponToDiscountCampaign_B_fkey` FOREIGN KEY (`B`) REFERENCES `DiscountCampaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
