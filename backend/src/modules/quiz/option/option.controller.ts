import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { OptionService } from "./option.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseMessage, Roles } from "src/core/decorator/customize";
import { CreateOptionDto, UpdateOptionDto } from "./dto/create-option.dto";

@ApiTags("Option")
@Controller("options")
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  // Create option
  @Post()
  @Roles("INSTRUCTOR", "ADMIN")
  @ApiOperation({ summary: "Create new option for a question" })
  @ResponseMessage("create new option")
  create(@Body() dto: CreateOptionDto) {
    return this.optionService.create(dto);
  }

  // Get all options
  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get all options" })
  @ResponseMessage("get all options")
  findAll() {
    return this.optionService.findAll();
  }

  // Get one option by id
  @Get(":id")
  @Roles("ADMIN", "INSTRUCTOR")
  @ApiOperation({ summary: "Get option by ID" })
  @ResponseMessage("get option by ID")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.optionService.findOne(id);
  }

  // Get all options of a question
  @Get("question/:questionId")
  @Roles("ADMIN", "INSTRUCTOR")
  @ApiOperation({ summary: "Get all options of a specific question" })
  @ResponseMessage("get options by question ID")
  findByQuestion(@Param("questionId", ParseIntPipe) questionId: number) {
    return this.optionService.findByQuestionId(questionId);
  }

  // Update option
  @Patch(":id")
  @Roles("INSTRUCTOR", "ADMIN")
  @ApiOperation({ summary: "Update option" })
  @ResponseMessage("update option")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateOptionDto) {
    return this.optionService.update(id, dto);
  }

  // Delete option
  @Delete(":id")
  @Roles("INSTRUCTOR", "ADMIN")
  @ApiOperation({ summary: "Delete option" })
  @ResponseMessage("delete option")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.optionService.remove(id);
  }
}
