import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AiService } from "./ai.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseMessage } from "src/core/decorator/customize";
import { ExplainTermDto } from "./dto/explain-term.dto";
import { ChatLessonDto } from "./dto/chat-lesson.dto";
import { JwtAuthGuard } from "src/modules/auth/passport/jwt-auth.guard";

@ApiTags("AI")
@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("term")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Explain a technical term" })
  @ResponseMessage("Term explained successfully")
  async explainTerm(@Body() dto: ExplainTermDto) {
    return this.aiService.explainTerm(dto);
  }

  @Post("chat-lesson")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Chat with AI about a specific lesson (RAG)" })
  @ResponseMessage("AI responded successfully")
  async chatLesson(@Body() dto: ChatLessonDto) {
    return this.aiService.chatLesson(dto);
  }
}
