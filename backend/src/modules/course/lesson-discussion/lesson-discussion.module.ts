import { Module } from '@nestjs/common';
import { LessonDiscussionService } from './lesson-discussion.service';
import { LessonDiscussionController } from './lesson-discussion.controller';
import { LessonDiscussionGateway } from './lesson-discussion.gateway';
import { NotificationModule } from 'src/modules/notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [LessonDiscussionController],
  providers: [LessonDiscussionService, LessonDiscussionGateway],
})
export class LessonDiscussionModule {}
