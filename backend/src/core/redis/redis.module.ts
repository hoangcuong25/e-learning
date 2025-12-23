import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule as IORedisModule } from "@nestjs-modules/ioredis";
import { redisConfig } from "./redis.config";
import { RedisService } from "./redis.service";

@Module({
  imports: [
    IORedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: redisConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [IORedisModule, RedisService],
})
export class RedisModule {}
