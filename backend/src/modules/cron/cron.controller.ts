import { Controller, Post } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CronService } from "./cron.service";
import { Public, ResponseMessage } from "src/core/decorator/customize";

@ApiTags("Cron")
@Controller("cron")
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Post("update-stats")
  @Public()
  @ApiOperation({
    summary: "Manually trigger stats update",
    description:
      "Updates course daily statistics for a specific date. If no date is provided, uses today's date. This endpoint is for testing and manual triggering.",
  })
  @ResponseMessage("Stats updated successfully")
  async updateStats() {
    await this.cronService.handleDailyStats();
    return {
      message: "Stats updated successfully",
    };
  }
}
