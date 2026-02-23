import { Module } from "@nestjs/common";
import { InstructorApplicationModule } from "./application/instructor-application.module";
import { InstructorAnalyticsModule } from "./analytics/instructor-analytics.module";
import { InstructorProfileModule } from "./profile/instructor-profile.module";

@Module({
  imports: [
    InstructorApplicationModule,
    InstructorAnalyticsModule,
    InstructorProfileModule,
  ],
  exports: [
    InstructorApplicationModule,
    InstructorAnalyticsModule,
    InstructorProfileModule,
  ],
})
export class InstructorModule {}
