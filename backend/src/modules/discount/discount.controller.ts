import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from "@nestjs/common";
import { DiscountService } from "./discount.service";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { UpdateDiscountDto } from "./dto/update-discount.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles, Public, ResponseMessage } from "src/core/decorator/customize";
import { PaginationQueryDto } from "src/core/dto/pagination-query.dto";

@ApiTags("Discount Campaign")
@Controller("discount")
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create new discount campaign" })
  @ResponseMessage("Create discount campaign")
  create(@Body() dto: CreateDiscountDto, @Req() req) {
    return this.discountService.create(dto, req.user.id);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: "Get all discount campaigns (with pagination and filters)",
  })
  @ResponseMessage("Get all discount campaigns")
  findAll(@Query() query: PaginationQueryDto) {
    return this.discountService.findAll(query);
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get discount campaign detail by ID" })
  @ResponseMessage("Get discount campaign detail")
  findOne(@Param("id") id: string) {
    return this.discountService.findOne(+id);
  }

  @Patch(":id")
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a discount campaign" })
  @ResponseMessage("Update discount campaign")
  update(@Param("id") id: string, @Body() dto: UpdateDiscountDto, @Req() req) {
    return this.discountService.update(+id, dto, req.user.id);
  }

  @Delete(":id")
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a discount campaign" })
  @ResponseMessage("Delete discount campaign")
  remove(@Param("id") id: string) {
    return this.discountService.remove(+id);
  }

  @Patch(":id/toggle")
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Toggle active status of discount campaign" })
  @ResponseMessage("Toggle discount campaign status")
  toggleStatus(@Param("id") id: string) {
    return this.discountService.toggleStatus(+id);
  }
}
