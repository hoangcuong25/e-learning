import { Module } from "@nestjs/common";
import { InstructorService } from "./instructor-application.service";
import { InstructorController } from "./instructor-application.controller";
import { NotificationModule } from "src/modules/notification/notification.module";

@Module({
  imports: [NotificationModule],
  controllers: [InstructorController],
  providers: [InstructorService],
  exports: [InstructorService],
})
export class InstructorApplicationModule {}
