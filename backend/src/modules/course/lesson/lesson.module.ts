import { Module } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { LessonController } from "./lesson.controller";
import { CloudinaryModule } from "src/core/cloudinary/cloudinary.module";
import { EnrollmentModule } from "src/modules/enrollment/enrollment.module";

@Module({
  imports: [CloudinaryModule, EnrollmentModule],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
