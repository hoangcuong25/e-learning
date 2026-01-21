import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";
import { CourseType } from "@prisma/client";

export class CreateCourseDto {
  @ApiProperty({ example: "React for Beginners", description: "Course title" })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional({ example: "Learn React step by step" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "Thumbnail image file",
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

  @ApiProperty({
    example: [1, 2],
    description:
      "List of specialization IDs that this course belongs to (must be approved specializations of the instructor)",
  })
  @Type(() => Number)
  @IsOptional()
  specializationIds: number[];

  @ApiProperty({ example: true, description: "Is the course free?" })
  @IsOptional()
  type: CourseType;
}
