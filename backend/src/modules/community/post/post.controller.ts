import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostQueryDto } from "./dto/post-query.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseMessage, Public } from "src/core/decorator/customize";
import { OptionalJwtAuthGuard } from "src/modules/auth/passport/jwt-optional.guard";

@ApiTags("Community - Post")
@Controller("community/posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new post" })
  @ResponseMessage("Create post successfully")
  create(@Body() createPostDto: CreatePostDto, @Req() req) {
    return this.postService.create(createPostDto, req.user.id);
  }

  @Get()
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: "Get all posts" })
  @ResponseMessage("Get posts successfully")
  findAll(@Query() query: PostQueryDto, @Req() req) {
    const currentUserId = req.user?.id || null;
    return this.postService.findAll(currentUserId, query);
  }

  @Get(":id")
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: "Get post detail" })
  @ResponseMessage("Get post detail successfully")
  findOne(@Param("id") id: string, @Req() req) {
    const userId = req.user?.id || null;
    return this.postService.findOne(+id, userId);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a post" })
  @ResponseMessage("Update post successfully")
  update(
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req
  ) {
    return this.postService.update(+id, updatePostDto, req.user.id);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a post" })
  @ResponseMessage("Delete post successfully")
  remove(@Param("id") id: string, @Req() req) {
    return this.postService.remove(+id, req.user.id, req.user.role);
  }

  @Post(":id/like")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Toggle like a post" })
  @ResponseMessage("Toggle like successfully")
  toggleLike(@Param("id") id: string, @Req() req) {
    return this.postService.toggleLike(+id, req.user.id);
  }

  @Post(":id/share")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Share a post" })
  @ResponseMessage("Share post successfully")
  share(
    @Param("id") id: string,
    @Req() req,
    @Body("content") content?: string
  ) {
    return this.postService.share(+id, req.user.id, content);
  }
}
