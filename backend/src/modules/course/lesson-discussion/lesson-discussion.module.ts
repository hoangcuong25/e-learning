import { Module } from '@nestjs/common';
import { LessonDiscussionService } from './lesson-discussion.service';
import { LessonDiscussionController } from './lesson-discussion.controller';
import { LessonDiscussionGateway } from './lesson-discussion.gateway';

@Module({
  controllers: [LessonDiscussionController],
  providers: [LessonDiscussionService, LessonDiscussionGateway],
})
export class LessonDiscussionModule {}
