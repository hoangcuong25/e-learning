import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  ValidateNested,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

class CreateOptionDto {
  @ApiProperty({ example: "React", description: "Nội dung lựa chọn" })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: true, description: "Lựa chọn đúng hay sai" })
  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @ApiProperty({
    example: "React là thư viện của ngôn ngữ nào?",
    description: "Nội dung câu hỏi",
  })
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @ApiProperty({
    example: 1,
    description: "ID của quiz chứa câu hỏi này",
  })
  @IsInt()
  @IsNotEmpty()
  quizId: number;

  @ApiProperty({
    description: "Các lựa chọn cho câu hỏi (Tùy chọn khi tạo câu hỏi)",
    type: [CreateOptionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];
}
