import { ConfigService } from "@nestjs/config";
import { RedisModuleOptions } from "@nestjs-modules/ioredis";

export const redisConfig = async (
  configService: ConfigService
): Promise<RedisModuleOptions> => ({
  type: "single",
  url: configService.get<string>("UPSTASH_REDIS_URL"),
  options: {
    // Upstash yêu cầu TLS
    tls: {
      rejectUnauthorized: false,
    },
    // Giới hạn retry (Upstash khuyên chỉ 1)
    maxRetriesPerRequest: 1,
    // Retry strategy tùy chỉnh (optional)
    retryStrategy: (times) => {
      if (times > 3) return null; // ngưng retry sau 3 lần
      return Math.min(times * 200, 1000); // delay tăng dần
    },
  },
});
