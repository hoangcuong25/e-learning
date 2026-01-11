import { Module } from "@nestjs/common";
import { RatingService } from "./course-rating.service";
import { RatingController } from "./course-rating.controller";
import { NotificationModule } from "src/modules/notification/notification.module";

@Module({
  imports: [NotificationModule],
  controllers: [RatingController],
  providers: [RatingService],
})
export class CourseRatingModule {}
