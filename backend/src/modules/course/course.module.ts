import { Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseController } from "./course.controller";
import { CloudinaryModule } from "src/core/cloudinary/cloudinary.module";
import { SpecializationModule } from "../specialization/specialization.module";
import { ChapterModule } from "./chapter/chapter.module";
import { LessonDiscussionModule } from "./lesson-discussion/lesson-discussion.module";
import { LessonDiscussionGateway } from "./lesson-discussion/lesson-discussion.gateway";
import { CourseRatingModule } from './course-rating/course-rating.module';

@Module({
  imports: [
    CloudinaryModule,
    SpecializationModule,
    ChapterModule,
    LessonDiscussionModule,
    CourseRatingModule,
  ],
  controllers: [CourseController],
  providers: [CourseService, LessonDiscussionGateway],
})
export class CourseModule {}
