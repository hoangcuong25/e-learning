/*
  Warnings:

  - A unique constraint covering the columns `[courseId,orderIndex]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Lesson_courseId_orderIndex_key` ON `Lesson`(`courseId`, `orderIndex`);
