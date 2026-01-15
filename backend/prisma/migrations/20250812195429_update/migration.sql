/*
  Warnings:

  - You are about to alter the column `refreshTokenExpires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `refreshToken` TEXT NULL,
    MODIFY `refreshTokenExpires` DATETIME(3) NULL;
