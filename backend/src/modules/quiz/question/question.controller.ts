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
import { QuestionService } from "./question.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseMessage, Roles } from "src/core/decorator/customize";
import { SaveQuestionDto } from "./dto/save-question.dto";

@ApiTags("Question")
@Controller("question")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Create new question for a quiz" })
  @ResponseMessage("Create question successfully")
  @ApiBearerAuth()
  create(@Body() createQuestionDto: CreateQuestionDto, @Req() req) {
    return this.questionService.create(createQuestionDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: "Get all questions" })
  @ResponseMessage("Get all questions successfully")
  @ApiBearerAuth()
  findAll() {
    return this.questionService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get question by ID (include options)" })
  @ResponseMessage("Get question by ID successfully")
  @ApiBearerAuth()
  findOne(@Param("id") id: string) {
    return this.questionService.findOne(+id);
  }

  @Patch(":id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Update question content" })
  @ResponseMessage("Update question successfully")
  @ApiBearerAuth()
  update(
    @Param("id") id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Req() req
  ) {
    return this.questionService.update(+id, updateQuestionDto, req.user.id);
  }

  @Patch("save-question/:id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Save question (create/update options)" })
  @ResponseMessage("Save question successfully")
  @ApiBearerAuth()
  saveQuestion(
    @Param("id") id: string,
    @Body() saveQuestionDto: SaveQuestionDto,
    @Req() req
  ) {
    return this.questionService.saveQuestion(+id, saveQuestionDto, req.user.id);
  }

  @Delete(":id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Delete question" })
  @ResponseMessage("Delete question successfully")
  @ApiBearerAuth()
  remove(@Param("id") id: string, @Req() req) {
    return this.questionService.remove(+id, req.user.id);
  }
}
