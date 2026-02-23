import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { PaginationQueryDto } from "src/core/dto/pagination-query.dto";

export class CourseQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    type: Boolean,
    description: "Filter by publish status",
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  @IsBoolean()
  isPublished?: boolean;
}
