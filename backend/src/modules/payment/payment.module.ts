import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { AuthModule } from "../auth/auth.module";
import { PaymentGateway } from "./payment.gateway";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [AuthModule, NotificationModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentGateway],
})
export class PaymentModule {}
