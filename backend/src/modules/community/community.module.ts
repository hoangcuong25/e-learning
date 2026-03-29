import { Module } from "@nestjs/common";
import { PostController } from "./post/post.controller";
import { PostService } from "./post/post.service";
import { CommentController } from "./comment/comment.controller";
import { CommentService } from "./comment/comment.service";
import { FollowController } from "./follow/follow.controller";
import { FollowService } from "./follow/follow.service";
import { ChatModule } from "./chat/chat.module";

@Module({
  imports: [ChatModule],
  controllers: [PostController, CommentController, FollowController],
  providers: [PostService, CommentService, FollowService],
})
export class CommunityModule {}
