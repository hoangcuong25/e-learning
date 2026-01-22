import { Module } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { LessonController } from "./lesson.controller";
import { CloudinaryModule } from "src/core/cloudinary/cloudinary.module";

@Module({
  imports: [CloudinaryModule],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
