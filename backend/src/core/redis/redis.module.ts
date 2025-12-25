import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule as IORedisModule } from "@nestjs-modules/ioredis";
import { redisConfig } from "./redis.config";

@Module({
  imports: [
    IORedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: redisConfig,
      inject: [ConfigService],
    }),
  ],
  exports: [IORedisModule],
})
export class RedisModule {}
