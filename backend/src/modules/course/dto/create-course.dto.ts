import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";

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
    example: 1,
    description: "Instructor ID who owns this course",
  })
  @Type(() => Number)
  @IsNumber()
  instructorId: number;
}
