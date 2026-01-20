import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { SpecializationService } from "./specialization.service";
import { CreateSpecializationDto } from "./dto/create-specialization.dto";
import { UpdateSpecializationDto } from "./dto/update-specialization.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public, ResponseMessage, Roles } from "src/core/decorator/customize";

@ApiTags("Specializations")
@Controller("specialization")
export class SpecializationController {
  constructor(private readonly specializationService: SpecializationService) {}

  @Post()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Tạo chuyên ngành mới" })
  @ResponseMessage("Tạo chuyên ngành thành công")
  create(@Body() createSpecializationDto: CreateSpecializationDto) {
    return this.specializationService.create(createSpecializationDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "Lấy danh sách tất cả chuyên ngành" })
  @ResponseMessage("Danh sách chuyên ngành")
  findAll() {
    return this.specializationService.findAll();
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Lấy chuyên ngành theo ID" })
  @ResponseMessage("Chi tiết chuyên ngành")
  findOne(@Param("id") id: string) {
    return this.specializationService.findOne(+id);
  }

  @Patch(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Cập nhật chuyên ngành" })
  @ResponseMessage("Cập nhật chuyên ngành thành công")
  update(
    @Param("id") id: string,
    @Body() updateSpecializationDto: UpdateSpecializationDto
  ) {
    return this.specializationService.update(+id, updateSpecializationDto);
  }

  @Delete(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Xóa chuyên ngành" })
  @ResponseMessage("Xóa chuyên ngành thành công")
  remove(@Param("id") id: string) {
    return this.specializationService.remove(+id);
  }
}
