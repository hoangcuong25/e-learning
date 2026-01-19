import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
} from "@nestjs/common";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { ResponseMessage, Roles } from "src/decorator/customize";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("course")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Roles("INSTRUCTOR", "ADMIN")
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Create new course" })
  @UseInterceptors(FileInterceptor("thumbnail"))
  create(
    @Body() dto: CreateCourseDto,
    @UploadedFile() thumbnail?: Express.Multer.File
  ) {
    return this.courseService.create(dto, thumbnail);
  }

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get all courses" })
  @ResponseMessage("Get all courses")
  findAll() {
    return this.courseService.findAll();
  }

  @Get(":id")
  @Roles("INSTRUCTOR", "ADMIN")
  @ApiOperation({ summary: "Get course detail by ID" })
  @ResponseMessage("Get course detail")
  findOne(@Param("id") id: string) {
    return this.courseService.findOne(+id);
  }

  @Get("instructors/me/courses")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Get all courses by instructor ID" })
  @ResponseMessage("Get courses by instructor")
  getCoursesByInstructor(@Req() req) {
    const instructorId = req.user.id;
    return this.courseService.getCoursesByInstructor(+instructorId);
  }

  @Patch(":id")
  @Roles("INSTRUCTOR", "ADMIN")
  @ApiOperation({ summary: "Update a course by ID" })
  @ApiConsumes("multipart/form-data")
  @ResponseMessage("Update course")
  @UseInterceptors(FileInterceptor("thumbnail"))
  update(
    @Param("id") id: string,
    @Body() updateCourseDto,
    @UploadedFile() thumbnail?: Express.Multer.File
  ) {
    return this.courseService.update(+id, updateCourseDto, thumbnail);
  }

  @Delete(":id")
  @Roles("INSTRUCTOR", "ADMIN")
  @ApiOperation({ summary: "Delete a course by ID" })
  @ResponseMessage("Delete course")
  remove(@Param("id") id: string) {
    return this.courseService.remove(+id);
  }
}
