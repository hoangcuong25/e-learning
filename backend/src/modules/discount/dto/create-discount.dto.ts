import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsBoolean,
} from "class-validator";

export class CreateDiscountDto {
  @ApiProperty({ example: "Black Friday Sale" })
  @IsString()
  title: string;

  @ApiProperty({ example: "Up to 50% off selected courses", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  percentage: number;

  @ApiProperty({ example: "2025-11-01T00:00:00Z" })
  @IsDateString()
  startsAt: string;

  @ApiProperty({ example: "2025-12-01T00:00:00Z" })
  @IsDateString()
  endsAt: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
