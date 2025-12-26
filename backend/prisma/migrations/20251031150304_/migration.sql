/*
  Warnings:

  - You are about to drop the column `courseId` on the `discountcampaign` table. All the data in the column will be lost.
  - You are about to drop the column `specializationId` on the `discountcampaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `discountcampaign` DROP COLUMN `courseId`,
    DROP COLUMN `specializationId`;
