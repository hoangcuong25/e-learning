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
import { QuizService } from "./quiz.service";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseMessage, Roles } from "src/core/decorator/customize";

@ApiTags("Quiz")
@Controller("quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Create new quiz for a lesson" })
  @ResponseMessage("Create quiz successfully")
  @ApiBearerAuth()
  create(@Body() createQuizDto: CreateQuizDto, @Req() req) {
    return this.quizService.create(createQuizDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: "Get all quizzes" })
  @ResponseMessage("Get all quizzes successfully")
  @ApiBearerAuth()
  findAll() {
    return this.quizService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get quiz by ID (include questions & options)" })
  @ResponseMessage("Get quiz by ID successfully")
  @ApiBearerAuth()
  findOne(@Param("id") id: string) {
    return this.quizService.findOne(+id);
  }

  @Get("instructor/quizzes")
  @ApiOperation({ summary: "Get quiz by instructorId " })
  @Roles("INSTRUCTOR")
  @ResponseMessage("Get quiz by instructorId successfully")
  @ApiBearerAuth()
  instructorQuizzes(@Req() req) {
    return this.quizService.instructorQuizzes(req.user.id);
  }

  @Patch(":id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Update quiz information" })
  @ResponseMessage("Update quiz successfully")
  @ApiBearerAuth()
  update(
    @Param("id") id: string,
    @Body() updateQuizDto: UpdateQuizDto,
    @Req() req
  ) {
    return this.quizService.update(+id, updateQuizDto, req.user.id);
  }

  @Delete(":id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Delete quiz" })
  @ResponseMessage("Delete quiz successfully")
  @ApiBearerAuth()
  remove(@Param("id") id: string, @Req() req) {
    return this.quizService.remove(+id, req.user.id);
  }
}
