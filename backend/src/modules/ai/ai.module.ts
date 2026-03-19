import { Module } from "@nestjs/common";
import { AiService } from "./ai.service";
import { AiController } from "./ai.controller";
import { RedisModule } from "src/core/redis/redis.module";
import { RagService } from "src/core/lib/ai/rag.service";
import { VectorStoreService } from "src/core/lib/ai/vector-store.service";

@Module({
  imports: [RedisModule],
  controllers: [AiController],
  providers: [AiService, RagService, VectorStoreService],
  exports: [AiService, RagService, VectorStoreService],
})
export class AiModule {}
