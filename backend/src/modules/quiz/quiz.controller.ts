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
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseMessage, Roles } from "src/core/decorator/customize";

@ApiTags("quiz")
@Controller("quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Create new quiz for a lesson" })
  @ResponseMessage("Create quiz successfully")
  create(@Body() createQuizDto: CreateQuizDto, @Req() req) {
    return this.quizService.create(createQuizDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: "Get all quizzes" })
  @ResponseMessage("Get all quizzes successfully")
  findAll() {
    return this.quizService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get quiz by ID (include questions & options)" })
  @ResponseMessage("Get quiz by ID successfully")
  findOne(@Param("id") id: string) {
    return this.quizService.findOne(+id);
  }

  @Get("instructor/quizzes")
  @ApiOperation({ summary: "Get quiz by instructorId " })
  @Roles("INSTRUCTOR")
  @ResponseMessage("Get quiz by instructorId successfully")
  instructorQuizzes(@Req() req) {
    return this.quizService.instructorQuizzes(req.user.id);
  }

  @Patch(":id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Update quiz information" })
  @ResponseMessage("Update quiz successfully")
  update(@Param("id") id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.update(+id, updateQuizDto);
  }

  @Delete(":id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Delete quiz" })
  @ResponseMessage("Delete quiz successfully")
  remove(@Param("id") id: string) {
    return this.quizService.remove(+id);
  }
}
