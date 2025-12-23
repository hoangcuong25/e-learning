import { Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseController } from "./course.controller";
import { CloudinaryModule } from "src/core/cloudinary/cloudinary.module";
import { SpecializationModule } from "../specialization/specialization.module";

@Module({
  imports: [CloudinaryModule, SpecializationModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
