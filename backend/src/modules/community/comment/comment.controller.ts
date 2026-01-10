import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public, ResponseMessage } from "src/core/decorator/customize";
import { CommentService } from "./comment.service";
import { CommentQueryDto } from "./dto/comment-query.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@ApiTags("Community - Comment")
@Controller("community")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post("comments")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a comment" })
  @ResponseMessage("Create comment successfully")
  create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    return this.commentService.create(req.user.id, createCommentDto);
  }

  @Get("posts/:postId/comments")
  @Public()
  @ApiOperation({ summary: "Get comments by post" })
  @ResponseMessage("Get comments successfully")
  findAllByPost(
    @Param("postId") postId: string,
    @Query() query: CommentQueryDto
  ) {
    return this.commentService.findAllByPost(+postId, query);
  }

  @Patch("comments/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a comment" })
  @ResponseMessage("Update comment successfully")
  update(
    @Param("id") id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req
  ) {
    return this.commentService.update(+id, req.user.id, updateCommentDto);
  }

  @Delete("comments/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a comment" })
  @ResponseMessage("Delete comment successfully")
  remove(@Param("id") id: string, @Req() req) {
    return this.commentService.remove(+id, req.user.id);
  }
}
