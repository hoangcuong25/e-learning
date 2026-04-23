import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FollowService } from "./follow.service";
import { ResponseMessage, Public } from "../../../core/decorator/customize";
import { PaginationQueryDto } from "../../../core/dto/pagination-query.dto";
import { OptionalJwtAuthGuard } from "../../auth/passport/jwt-optional.guard";

@ApiTags("Community - Follow")
@Controller("community/follow")
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Follow a user" })
  @ResponseMessage("Follow user successfully")
  follow(@Param("id", ParseIntPipe) id: number, @Req() req) {
    return this.followService.follow(req.user.id, id);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Unfollow a user" })
  @ResponseMessage("Unfollow user successfully")
  unfollow(@Param("id", ParseIntPipe) id: number, @Req() req) {
    return this.followService.unfollow(req.user.id, id);
  }

  @Get(":id/followers")
  @Public()
  @ApiOperation({ summary: "Get followers of a user" })
  @ResponseMessage("Get followers successfully")
  getFollowers(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: PaginationQueryDto
  ) {
    return this.followService.getFollowers(id, query);
  }

  @Get(":id/following")
  @Public()
  @ApiOperation({ summary: "Get who a user is following" })
  @ResponseMessage("Get following list successfully")
  getFollowing(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: PaginationQueryDto
  ) {
    return this.followService.getFollowing(id, query);
  }

  @Get(":id/is-following")
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: "Check if current user is following target user" })
  @ResponseMessage("Check follow status successfully")
  isFollowing(@Param("id", ParseIntPipe) id: number, @Req() req) {
    const followerId = req.user?.id;
    if (!followerId) return { isFollowing: false }; // Guest
    return this.followService.isFollowing(followerId, id);
  }

  @Get("suggestions")
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: "Get follow suggestions" })
  @ResponseMessage("Get follow suggestions successfully")
  getSuggestions(@Req() req, @Query() query: PaginationQueryDto) {
    const userId = req.user?.id;
    return this.followService.getSuggestions(userId, query);
  }
}
