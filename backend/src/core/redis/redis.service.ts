import { Injectable, Logger } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  // Basic key-value operations
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const data = typeof value === "string" ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await this.redis.set(key, data, "EX", ttlSeconds);
    } else {
      await this.redis.set(key, data);
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return data as T;
    }
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  // Publish / Subscribe
  async publish(channel: string, message: any): Promise<number> {
    const data =
      typeof message === "string" ? message : JSON.stringify(message);
    return this.redis.publish(channel, data);
  }

  async subscribe(
    channel: string,
    callback: (message: string) => void
  ): Promise<void> {
    const subscriber = this.redis.duplicate();
    await subscriber.subscribe(channel);

    subscriber.on("message", (ch, message) => {
      if (ch === channel) {
        callback(message);
      }
    });

    this.logger.log(`Subscribed to Redis channel: ${channel}`);
  }

  //  Utility functions
  async flushAll(): Promise<void> {
    await this.redis.flushall();
    this.logger.warn("All Redis keys have been cleared.");
  }

  async keys(pattern = "*"): Promise<string[]> {
    return this.redis.keys(pattern);
  }
}
