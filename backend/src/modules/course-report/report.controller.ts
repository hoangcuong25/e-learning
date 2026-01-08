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
import { ReportService } from "./report.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles, Public, ResponseMessage } from "src/core/decorator/customize";

@ApiTags("Course Report")
@Controller("course-report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // User gửi report
  @Post()
  @ApiOperation({ summary: "User send course report" })
  @ApiBearerAuth()
  @ResponseMessage("Report created")
  create(@Body() dto: CreateReportDto, @Req() req) {
    return this.reportService.create(dto, req.user.id);
  }

  // Admin xem tất cả report
  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Admin get all reports with filters" })
  @ApiBearerAuth()
  @ResponseMessage("Get all reports")
  findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("type") type?: string
  ) {
    return this.reportService.findAll(page, limit, type);
  }

  // Admin xem chi tiết 1 report
  @Get(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Admin get report detail" })
  @ApiBearerAuth()
  @ResponseMessage("Get report detail")
  findOne(@Param("id") id: string) {
    return this.reportService.findOne(+id);
  }

  // Admin xử lý report
  // @Patch(":id")
  // @Roles("ADMIN")
  // @ApiOperation({ summary: "Admin update report" })
  // @ApiBearerAuth()
  // @ResponseMessage("Update report")
  // update(@Param("id") id: string, @Body() dto: UpdateReportDto) {
  //   return this.reportService.update(+id, dto);
  // }

  // Admin xóa report
  @Delete(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Admin delete report" })
  @ApiBearerAuth()
  @ResponseMessage("Delete report")
  remove(@Param("id") id: string) {
    return this.reportService.remove(+id);
  }
}
