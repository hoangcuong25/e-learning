import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseMessage, Roles } from "src/core/decorator/customize";
import { AdminAnalyticsService } from "./admin-analytics.service";

@ApiTags("Admin Analytics")
@Controller("admin/analytics")
@Roles("ADMIN")
@ApiBearerAuth()
export class AdminAnalyticsController {
  constructor(private readonly adminAnalyticsService: AdminAnalyticsService) {}

  @Get("overview")
  @ApiOperation({ summary: "Get admin dashboard overview statistics" })
  @ResponseMessage("Get admin dashboard overview statistics")
  getOverview() {
    return this.adminAnalyticsService.getOverview();
  }
}
