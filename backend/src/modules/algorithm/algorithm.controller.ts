import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AlgorithmService } from "./algorithm.service";
import { AlgorithmLanguage } from "@prisma/client";
import { Public, ResponseMessage } from "src/core/decorator/customize";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Algorithm")
@Controller("algorithm")
export class AlgorithmController {
  constructor(private readonly algorithmService: AlgorithmService) {}

  @Public()
  @Get("categories")
  @ApiOperation({ summary: "Get all algorithm categories" })
  @ResponseMessage("Get algorithm categories successfully")
  getCategories() {
    return this.algorithmService.getCategories();
  }

  @Public()
  @Get("problems")
  @ApiOperation({ summary: "Get algorithm problems with search and filters" })
  @ResponseMessage("Get algorithm problems successfully")
  getProblems(
    @Query("categoryId") categoryId?: number,
    @Query("difficulty") difficulty?: string,
    @Query("search") search?: string
  ) {
    return this.algorithmService.getProblems({
      categoryId,
      difficulty,
      search,
    });
  }

  @Public()
  @Get("problems/:slug")
  @ApiOperation({ summary: "Get algorithm problem detail by slug" })
  @ResponseMessage("Get algorithm problem detail successfully")
  getProblemBySlug(@Param("slug") slug: string) {
    return this.algorithmService.getProblemBySlug(slug);
  }

  @Post("submissions")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Submit code for an algorithm problem" })
  @ResponseMessage("Submit algorithm successfully")
  createSubmission(
    @Req() req,
    @Body()
    body: { problemId: number; code: string; language: AlgorithmLanguage }
  ) {
    return this.algorithmService.createSubmission(req.user.id, body);
  }

  @Get("submissions/status/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get status of a submission" })
  @ResponseMessage("Get submission status successfully")
  getSubmissionStatus(@Param("id") id: string) {
    return this.algorithmService.getSubmissionStatus(+id);
  }

  @Get("my-submissions")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user's submissions" })
  @ResponseMessage("Get my submissions successfully")
  getMySubmissions(@Req() req, @Query("problemId") problemId?: number) {
    return this.algorithmService.getUserSubmissions(req.user.id, problemId);
  }
}
