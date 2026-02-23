import { Module } from "@nestjs/common";
import { CronService } from "./cron.service";
import { CronController } from "./cron.controller";
import { PrismaModule } from "src/core/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [CronController],
  providers: [CronService],
})
export class CronModule {}
