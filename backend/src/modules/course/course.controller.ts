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
  Query,
} from "@nestjs/common";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { Public, ResponseMessage, Roles } from "src/core/decorator/customize";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { PaginationQueryDto } from "src/core/dto/pagination-query.dto";

@ApiTags("Course")
@Controller("course")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Roles("INSTRUCTOR")
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Create new course" })
  @UseInterceptors(FileInterceptor("thumbnail"))
  @ApiBearerAuth()
  create(
    @Body() dto: CreateCourseDto,
    @Req() req,
    @UploadedFile() thumbnail?: Express.Multer.File
  ) {
    return this.courseService.create(dto, req.user.id, thumbnail);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "Get all courses with pagination and filter" })
  @ResponseMessage("Get all courses")
  findAll(@Query() dto: PaginationQueryDto) {
    return this.courseService.findAll(dto);
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get course detail by ID" })
  @ResponseMessage("Get course detail")
  findCourseById(@Param("id") id: string) {
    return this.courseService.findCourseById(+id);
  }

  @Get(":id/instructor")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Get course detail by ID" })
  @ResponseMessage("Get course detail")
  @ApiBearerAuth()
  findOne(@Param("id") id: string, @Req() req) {
    return this.courseService.findOne(+id, req.user.id);
  }

  @Get("instructors/me/courses")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Get all courses by instructor ID" })
  @ResponseMessage("Get courses by instructor")
  @ApiBearerAuth()
  getCoursesByInstructor(@Req() req) {
    const instructorId = req.user.id;
    return this.courseService.getCoursesByInstructor(+instructorId);
  }

  @Patch("instructor/course/:id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Update a course by ID" })
  @ApiConsumes("multipart/form-data")
  @ResponseMessage("Update course")
  @UseInterceptors(FileInterceptor("thumbnail"))
  @ApiBearerAuth()
  update(
    @Param("id") id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req: any,
    @UploadedFile() thumbnail?: Express.Multer.File
  ) {
    return this.courseService.update(
      +id,
      updateCourseDto,
      thumbnail,
      req.user.id
    );
  }

  @Delete("instructor/course/:id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Delete a course by ID" })
  @ResponseMessage("Delete course")
  @ApiBearerAuth()
  remove(@Param("id") id: string, @Req() req) {
    return this.courseService.remove(+id, req.user.id);
  }

  @Post(":id/rating")
  @ApiOperation({ summary: "Rate a course by ID" })
  @ResponseMessage("Rate course")
  @ApiBearerAuth()
  rateCourse(
    @Param("id") id: string,
    @Body("rating") rating: number,
    @Body("text") text: string,
    @Req() req
  ) {
    return this.courseService.rateCourse(+id, rating, text, req.user.id);
  }

  @Post(":id/view")
  @ApiOperation({ summary: "Increase course view count" })
  @ResponseMessage("Increase course view")
  @ApiBearerAuth()
  increaseView(@Param("id") id: string, @Req() req) {
    const userId = req.user?.id;
    return this.courseService.increaseView(+id, userId);
  }

  @Get(":id/detail")
  @ApiOperation({ summary: "User Get course detail" })
  @ResponseMessage("User Get full course detail")
  @ApiBearerAuth()
  async getCourseDetail(@Param("id") id: string, @Req() req) {
    return this.courseService.getCourseDetail(+id, req.user.id);
  }
}
