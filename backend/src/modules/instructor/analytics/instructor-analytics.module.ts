import { Module } from "@nestjs/common";
import { InstructorAnalyticsService } from "./instructor-analytics.service";
import { InstructorAnalyticsController } from "./instructor-analytics.controller";

@Module({
  controllers: [InstructorAnalyticsController],
  providers: [InstructorAnalyticsService],
})
export class InstructorAnalyticsModule {}