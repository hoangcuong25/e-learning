import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
} from "class-validator";

export class CreateOptionDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsBoolean()
  isCorrect: boolean;

  @IsNumber()
  questionId: number;
}

export class UpdateOptionDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;
}

export class CreateManyOptionsDto {
  @ApiProperty({ type: [CreateOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}
