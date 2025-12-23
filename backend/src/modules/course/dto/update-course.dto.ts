import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";
import { CourseType } from "@prisma/client";

export class UpdateCourseDto {
  @ApiPropertyOptional({
    example: "React for Beginners",
    description: "Course title",
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @ApiPropertyOptional({ example: "Learn React step by step" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "Thumbnail image file (optional for update)",
  })
  @IsOptional()
  thumbnail?: any;

  @ApiPropertyOptional({ example: 499000, description: "Course price (VNĐ)" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: false, description: "Publish status" })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({
    example: [1, 2],
    description: "Updated list of specialization IDs (optional)",
  })
  @IsOptional()
  @Type(() => Number)
  specializationIds?: number[];

  @ApiPropertyOptional({
    example: "FREE",
    description: "Is the course free or paid?",
  })
  @IsOptional()
  type?: CourseType;
}
