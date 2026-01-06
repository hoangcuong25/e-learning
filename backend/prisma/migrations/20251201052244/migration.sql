/*
  Warnings:

  - A unique constraint covering the columns `[courseId,date]` on the table `CourseDailyStats` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[instructorId,date]` on the table `InstructorDailyStats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CourseDailyStats_courseId_date_key` ON `CourseDailyStats`(`courseId`, `date`);

-- CreateIndex
CREATE UNIQUE INDEX `InstructorDailyStats_instructorId_date_key` ON `InstructorDailyStats`(`instructorId`, `date`);
