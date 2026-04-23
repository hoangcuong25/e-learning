import { Module } from "@nestjs/common";
import { SpecializationService } from "./specialization.service";
import { SpecializationController } from "./specialization.controller";
import { RedisModule } from "../../core/redis/redis.module";

@Module({
  imports: [RedisModule],
  controllers: [SpecializationController],
  providers: [SpecializationService],
  exports: [SpecializationService],
})
export class SpecializationModule {}
