import { Controller, Get, Query, Req } from "@nestjs/common";
import { InstructorAnalyticsService } from "./instructor-analytics.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseMessage, Roles } from "src/core/decorator/customize";
import { GetDailyStatsDto } from "./dto/get-daily-stats.dto";
import { GetEarningsDto } from "./dto/get-earnings.dto";

@ApiTags("Instructor Analytics")
@Controller("instructor-analytics")
export class InstructorAnalyticsController {
  constructor(
    private readonly instructorAnalyticsService: InstructorAnalyticsService
  ) {}

  @Get("overview")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Get instructor overview statistics" })
  @ResponseMessage("Get instructor overview statistics")
  @ApiBearerAuth()
  getOverview(@Req() req) {
    const instructorId = req.user.id;
    return this.instructorAnalyticsService.getOverview(instructorId);
  }

  @Get("daily-stats")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Get instructor daily statistics" })
  @ResponseMessage("Get instructor daily statistics")
  @ApiBearerAuth()
  getDailyStats(@Query() dto: GetDailyStatsDto, @Req() req) {
    const instructorId = req.user.id;
    const startDate = dto.startDate ? new Date(dto.startDate) : undefined;
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;
    return this.instructorAnalyticsService.getDailyStats(
      instructorId,
      startDate,
      endDate
    );
  }

  @Get("courses")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Get analytics for all instructor courses" })
  @ResponseMessage("Get course analytics")
  @ApiBearerAuth()
  getCourseAnalytics(@Req() req) {
    const instructorId = req.user.id;
    return this.instructorAnalyticsService.getCourseAnalytics(instructorId);
  }

  @Get("earnings")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Get instructor earnings history" })
  @ResponseMessage("Get earnings history")
  @ApiBearerAuth()
  getEarningsHistory(@Query() dto: GetEarningsDto, @Req() req) {
    const instructorId = req.user.id;
    return this.instructorAnalyticsService.getEarningsHistory(
      instructorId,
      dto
    );
  }

  @Get("enrollment-stats")
  @Roles("INSTRUCTOR")
  @ApiOperation({
    summary: "Get enrollment statistics for all instructor courses",
  })
  @ResponseMessage("Get enrollment statistics")
  @ApiBearerAuth()
  getEnrollmentStats(
    // @Query() dto: GetCourseAnalyticsDto,
    @Req() req
  ) {
    const instructorId = req.user.id;
    return this.instructorAnalyticsService.getEnrollmentStats(instructorId);
  }
}
