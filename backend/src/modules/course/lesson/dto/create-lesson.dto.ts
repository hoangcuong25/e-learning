import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from "class-validator";

export class CreateLessonDto {
  @ApiProperty({ example: "Introduction to JavaScript" })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: "<p>This is HTML content</p>", required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @ApiProperty({ example: 3 })
  @IsNotEmpty()
  @IsInt()
  chapterId: number;
}
