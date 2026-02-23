import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsDateString } from "class-validator";

export class GetDailyStatsDto {
  @ApiPropertyOptional({
    description: "Start date for filtering (YYYY-MM-DD)",
    example: "2025-11-01",
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: "End date for filtering (YYYY-MM-DD)",
    example: "2025-11-30",
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
