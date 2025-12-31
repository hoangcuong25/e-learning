import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { LessonDiscussionService } from "./lesson-discussion.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public, Roles, ResponseMessage } from "src/core/decorator/customize";
import {
  CreateAnswerDto,
  CreateQuestionDto,
  CreateReplyDto,
} from "./dto/create-lesson-discussion.dto";

@ApiTags("Lesson Discussion")
@Controller("lesson-discussion")
export class LessonDiscussionController {
  constructor(private readonly service: LessonDiscussionService) {}

  @Post(":lessonId/questions")
  @Roles("STUDENT", "INSTRUCTOR")
  @ApiOperation({ summary: "Create a question in a lesson" })
  @ResponseMessage("Create question")
  @ApiBearerAuth()
  createQuestion(
    @Param("lessonId") lessonId: string,
    @Body() dto: CreateQuestionDto,
    @Req() req
  ) {
    return this.service.createQuestion(+lessonId, req.user.id, dto);
  }

  @Get(":lessonId/questions")
  @Public()
  @ApiOperation({ summary: "Get all questions for a lesson" })
  @ResponseMessage("Get lesson questions")
  getQuestions(@Param("lessonId") lessonId: string) {
    return this.service.getQuestions(+lessonId);
  }

  @Post("questions/:questionId/answers")
  @Roles("STUDENT", "INSTRUCTOR")
  @ApiOperation({ summary: "Answer a question" })
  @ResponseMessage("Create answer")
  @ApiBearerAuth()
  createAnswer(
    @Param("questionId") questionId: string,
    @Body() dto: CreateAnswerDto,
    @Req() req
  ) {
    return this.service.createAnswer(+questionId, req.user.id, dto);
  }

  @Post("answers/:answerId/replies")
  @Roles("STUDENT", "INSTRUCTOR")
  @ApiOperation({ summary: "Reply to an answer" })
  @ResponseMessage("Create reply")
  @ApiBearerAuth()
  createReply(
    @Param("answerId") answerId: string,
    @Body() dto: CreateReplyDto,
    @Req() req
  ) {
    return this.service.createReply(+answerId, req.user.id, dto);
  }

  @Delete("questions/:id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Delete a question" })
  @ResponseMessage("Delete question")
  @ApiBearerAuth()
  deleteQuestion(@Param("id") id: string) {
    return this.service.deleteQuestion(+id);
  }

  @Delete("answers/:id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Delete an answer or reply" })
  @ResponseMessage("Delete answer")
  @ApiBearerAuth()
  deleteAnswer(@Param("id") id: string) {
    return this.service.deleteAnswer(+id);
  }
}
