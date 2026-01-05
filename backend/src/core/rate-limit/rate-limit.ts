import { ThrottlerModuleOptions } from "@nestjs/throttler";

export const THROTTLER_TTL_MS = 60000;
export const THROTTLER_LIMIT = 100;

export const THROTTLER_CONFIG: ThrottlerModuleOptions = [
  {
    name: "default",
    ttl: THROTTLER_TTL_MS,
    limit: THROTTLER_LIMIT,
  },
];
