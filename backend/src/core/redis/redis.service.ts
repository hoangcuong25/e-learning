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

  /**
   * Delete all keys matching a pattern
   * @param pattern - Redis key pattern (e.g., "course:*")
   */
  async delPattern(pattern: string): Promise<number> {
    const keys = await this.redis.keys(pattern);
    if (keys.length === 0) return 0;
    return this.redis.del(...keys);
  }

  /**
   * Get from cache or execute callback and cache the result
   * @param key - Cache key
   * @param callback - Function to execute if cache miss
   * @param ttlSeconds - TTL in seconds
   */
  async getOrSet<T>(
    key: string,
    callback: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      this.logger.debug(`Cache hit: ${key}`);
      return cached;
    }

    this.logger.debug(`Cache miss: ${key}`);
    const result = await callback();
    await this.set(key, result, ttlSeconds);
    return result;
  }
}
