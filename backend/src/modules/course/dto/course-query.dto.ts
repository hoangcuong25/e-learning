import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { PaginationQueryDto } from "../../../core/dto/pagination-query.dto";

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

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: "Filter by instructor",
    example: "1",
  })
  instructorId?: string;
}
