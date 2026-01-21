import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ResponseMessage, Roles } from "src/core/decorator/customize";

@ApiTags("Lesson")
@Controller("lesson")
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @Roles("INSTRUCTOR")
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Instructor create a new lesson" })
  @ResponseMessage("Lesson created successfully")
  @UseInterceptors(FileInterceptor("video"))
  @ApiBearerAuth()
  create(
    @Body() dto: CreateLessonDto,
    @Req() req: any,
    @UploadedFile() video?: Express.Multer.File
  ) {
    const instructorId = req.user?.id;
    return this.lessonService.create(dto, instructorId, video);
  }

  @Patch(":id")
  @Roles("INSTRUCTOR")
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Update lesson by ID" })
  @ResponseMessage("Lesson updated successfully")
  @UseInterceptors(FileInterceptor("video"))
  @ApiBearerAuth()
  update(
    @Param("id") id: string,
    @Body() dto: UpdateLessonDto,
    @Req() req: any,
    @UploadedFile() video?: Express.Multer.File
  ) {
    return this.lessonService.update(+id, dto, req.user.id, video);
  }

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get all lessons" })
  @ResponseMessage("Fetched all lessons")
  @ApiBearerAuth()
  findAll() {
    return this.lessonService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get lesson detail by ID" })
  @ResponseMessage("Fetched lesson detail")
  @ApiBearerAuth()
  findOne(@Param("id") id: string, @Req() req: any) {
    return this.lessonService.findOne(+id);
  }

  @Get("course/:courseId")
  @ApiOperation({ summary: "Get all lessons by course ID" })
  @ResponseMessage("Fetched lessons by course")
  @ApiBearerAuth()
  getLessonsByCourse(@Param("courseId") courseId: string) {
    return this.lessonService.getLessonsByCourse(+courseId);
  }

  @Delete(":id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Delete lesson by ID" })
  @ResponseMessage("Lesson deleted successfully")
  @ApiBearerAuth()
  remove(@Param("id") id: string) {
    return this.lessonService.remove(+id);
  }
}
