import { ApiPropertyOptional } from "@nestjs/swagger";
import { PostVisibility } from "@prisma/client";
import { IsEnum, IsInt, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { PaginationQueryDto } from "src/core/dto/pagination-query.dto";

export class PostQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Filter by author ID",
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  authorId?: number;

  @ApiPropertyOptional({
    enum: PostVisibility,
    description: "Filter by visibility",
  })
  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;
}
