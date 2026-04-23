import { Module } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { LessonController } from "./lesson.controller";
import { CloudinaryModule } from "../../../core/cloudinary/cloudinary.module";
import { EnrollmentModule } from "../../enrollment/enrollment.module";
import { AiModule } from "../../ai/ai.module";

@Module({
  imports: [CloudinaryModule, EnrollmentModule, AiModule],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
