import { Body, Controller, Post } from "@nestjs/common";
import { AiService } from "./ai.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseMessage } from "src/core/decorator/customize";
import { ExplainTermDto } from "./dto/explain-term.dto";

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
}
