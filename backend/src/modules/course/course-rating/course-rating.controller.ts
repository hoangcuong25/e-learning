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
} from "@nestjs/common";
import { RatingService } from "./course-rating.service";
import { CreateRatingDto } from "./dto/create-course-rating.dto";
import { UpdateRatingDto } from "./dto/update-course-rating.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public, ResponseMessage, Roles } from "src/core/decorator/customize";

@ApiTags("Rating")
@Controller("rating")
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @ApiOperation({ summary: "Create a new course rating" })
  @ResponseMessage("Create rating successfully")
  @ApiBearerAuth()
  create(@Body() dto: CreateRatingDto, @Req() req) {
    return this.ratingService.create(dto, req.user.id);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: "Get all ratings with optional course ID, pagination and filter",
  })
  @ResponseMessage("Get all ratings")
  findAll(
    @Query("courseId") courseId: string,
    @Query("page") page = 1,
    @Query("limit") limit = 10
  ) {
    const parsedCourseId = courseId ? +courseId : undefined;
    return this.ratingService.findAll(parsedCourseId, +page, +limit);
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get rating detail by ID" })
  @ResponseMessage("Get rating detail")
  findOne(@Param("id") id: string) {
    return this.ratingService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a rating by ID" })
  @ResponseMessage("Update rating successfully")
  @ApiBearerAuth()
  update(@Param("id") id: string, @Body() dto: UpdateRatingDto, @Req() req) {
    return this.ratingService.update(+id, dto, req.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a rating by ID" })
  @ResponseMessage("Delete rating successfully")
  @ApiBearerAuth()
  remove(@Param("id") id: string, @Req() req) {
    return this.ratingService.remove(+id, req.user.id);
  }
}
