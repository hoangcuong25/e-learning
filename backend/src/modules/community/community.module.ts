import { Module } from "@nestjs/common";
import { PostController } from "./post/post.controller";
import { PostService } from "./post/post.service";
import { CommentController } from "./comment/comment.controller";
import { CommentService } from "./comment/comment.service";

@Module({
  controllers: [PostController, CommentController],
  providers: [PostService, CommentService],
})
export class CommunityModule {}
