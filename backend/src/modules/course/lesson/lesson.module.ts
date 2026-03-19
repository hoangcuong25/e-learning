import { Module } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { LessonController } from "./lesson.controller";
import { CloudinaryModule } from "src/core/cloudinary/cloudinary.module";
import { EnrollmentModule } from "src/modules/enrollment/enrollment.module";
import { AiModule } from "src/modules/ai/ai.module";

@Module({
  imports: [CloudinaryModule, EnrollmentModule, AiModule],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
