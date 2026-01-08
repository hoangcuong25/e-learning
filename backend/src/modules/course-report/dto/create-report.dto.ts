import { ApiProperty } from "@nestjs/swagger";
import { CourseReportType } from "@prisma/client";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from "class-validator";

export class CreateReportDto {
  @ApiProperty()
  @IsNumber()
  courseId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: CourseReportType })
  @IsEnum(CourseReportType)
  @IsOptional()
  type?: CourseReportType = CourseReportType.INAPPROPRIATE;
}
