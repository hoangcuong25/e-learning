import { Module } from "@nestjs/common";
import { InstructorService } from "./instructor-application.service";
import { InstructorController } from "./instructor-application.controller";

@Module({
  imports: [],
  controllers: [InstructorController],
  providers: [InstructorService],
  exports: [InstructorService],
})
export class InstructorApplicationModule {}
