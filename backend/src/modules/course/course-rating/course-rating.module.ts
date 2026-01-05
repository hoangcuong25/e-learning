import { Module } from "@nestjs/common";
import { RatingService } from "./course-rating.service";
import { RatingController } from "./course-rating.controller";

@Module({
  controllers: [RatingController],
  providers: [RatingService],
})
export class CourseRatingModule {}
