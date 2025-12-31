import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationGateway } from "./notification.gateway";
import { NotificationController } from "./notification.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  providers: [NotificationGateway, NotificationService],
  imports: [AuthModule],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
