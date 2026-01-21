import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class AppService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  getHello(): string {
    return "Hello World!";
  }

  async onModuleInit() {
    try {
      await this.redis.set("ping", "pong");
      console.log("✅ Redis connected:", await this.redis.get("ping"));
    } catch (error) {
      console.error("❌ Redis connection failed:", error.message);
    }
  }
}
