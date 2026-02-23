import { IsOptional, IsDateString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCourseDailyStatsDto {
  @ApiPropertyOptional({
    description: "Date to update stats for (ISO format). Defaults to today.",
    example: "2025-11-30",
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
