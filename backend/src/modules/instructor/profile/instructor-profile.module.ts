import { Module } from "@nestjs/common";
import { InstructorProfileController } from "./instructor-profile.controller";
import { InstructorProfileService } from "./instructor-profile.service";

@Module({
  controllers: [InstructorProfileController],
  providers: [InstructorProfileService],
  exports: [InstructorProfileService],
})
export class InstructorProfileModule {}
