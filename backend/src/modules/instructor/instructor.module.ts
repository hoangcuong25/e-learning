import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';

@Module({
  imports: [],
  controllers: [InstructorController],
  providers: [InstructorService],
})
export class InstructorModule {}
