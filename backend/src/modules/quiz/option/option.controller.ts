import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { OptionService } from "./option.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseMessage, Roles } from "src/core/decorator/customize";
import {
  CreateManyOptionsDto,
  CreateOptionDto,
  UpdateOptionDto,
} from "./dto/create-option.dto";

@ApiTags("Option")
@Controller("options")
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  // Create option
  @Post()
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Create new option for a question" })
  @ResponseMessage("create new option")
  @ApiBearerAuth()
  create(@Body() dto: CreateOptionDto, @Req() req) {
    return this.optionService.create(dto, req.user.id);
  }

  // Create many option
  @Post("bulk")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Create multiple options for a question" })
  @ResponseMessage("create multiple options")
  @ApiBearerAuth()
  createMany(@Body() dto: CreateManyOptionsDto, @Req() req) {
    return this.optionService.createMany(dto.options, req.user.id);
  }

  // Get all options
  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get all options" })
  @ResponseMessage("get all options")
  @ApiBearerAuth()
  findAll() {
    return this.optionService.findAll();
  }

  // Get one option by id
  @Get(":id")
  @Roles("ADMIN", "INSTRUCTOR")
  @ApiOperation({ summary: "Get option by ID" })
  @ResponseMessage("get option by ID")
  @ApiBearerAuth()
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.optionService.findOne(id);
  }

  // Get all options of a question
  @Get("question/:questionId")
  @Roles("ADMIN", "INSTRUCTOR")
  @ApiOperation({ summary: "Get all options of a specific question" })
  @ResponseMessage("get options by question ID")
  @ApiBearerAuth()
  findByQuestion(@Param("questionId", ParseIntPipe) questionId: number) {
    return this.optionService.findByQuestionId(questionId);
  }

  // Update option
  @Patch(":id")
  @Roles("INSTRUCTOR", "ADMIN")
  @ApiOperation({ summary: "Update option" })
  @ResponseMessage("update option")
  @ApiBearerAuth()
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateOptionDto) {
    return this.optionService.update(id, dto);
  }

  // Delete option
  @Delete(":id")
  @Roles("INSTRUCTOR", "ADMIN")
  @ApiOperation({ summary: "Delete option" })
  @ResponseMessage("delete option")
  @ApiBearerAuth()
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.optionService.remove(id);
  }
}
