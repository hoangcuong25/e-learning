import { Module } from "@nestjs/common";
import { AlgorithmService } from "./algorithm.service";
import { AlgorithmController } from "./algorithm.controller";

@Module({
  controllers: [AlgorithmController],
  providers: [AlgorithmService],
  exports: [AlgorithmService],
})
export class AlgorithmModule {}
