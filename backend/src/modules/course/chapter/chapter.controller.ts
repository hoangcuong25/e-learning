import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import { CreateChapterDto } from "./dto/create-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles, ResponseMessage, Public } from "src/core/decorator/customize";

@ApiTags("Chapter")
@Controller("chapter")
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post("course/:courseId")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Create a new chapter for a course" })
  @ResponseMessage("Create chapter successfully")
  @ApiBearerAuth()
  create(
    @Param("courseId") courseId: string,
    @Body() dto: CreateChapterDto,
    @Req() req
  ) {
    return this.chapterService.create(+courseId, dto, req.user.id);
  }

  @Get("course/:courseId")
  @Public()
  @ApiOperation({ summary: "Get all chapters by course ID" })
  @ResponseMessage("Get all chapters successfully")
  findAll(@Param("courseId") courseId: string) {
    return this.chapterService.findAll(+courseId);
  }

  @Get(":id/course/:courseId")
  @Public()
  @ApiOperation({ summary: "Get chapter detail by ID" })
  @ResponseMessage("Get chapter detail successfully")
  findOne(@Param("courseId") courseId: string, @Param("id") id: string) {
    return this.chapterService.findOne(+courseId, +id);
  }

  @Patch(":id/course/:courseId")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Update a chapter by ID" })
  @ResponseMessage("Update chapter successfully")
  @ApiBearerAuth()
  update(
    @Param("courseId") courseId: string,
    @Param("id") id: string,
    @Body() dto: UpdateChapterDto,
    @Req() req
  ) {
    return this.chapterService.update(+courseId, +id, dto, req.user.id);
  }

  @Delete(":id/course/:courseId")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Delete a chapter by ID" })
  @ResponseMessage("Delete chapter successfully")
  @ApiBearerAuth()
  remove(
    @Param("courseId") courseId: string,
    @Param("id") id: string,
    @Req() req
  ) {
    return this.chapterService.remove(+courseId, +id, req.user.id);
  }
}
