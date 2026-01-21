import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

class OptionDto {
  @ApiProperty({ example: "React", description: "Nội dung lựa chọn" })
  @IsString()
  @IsNotEmpty()
  optionText: string;

  @ApiProperty({ example: true, description: "Lựa chọn đúng hay sai" })
  @IsBoolean()
  isCorrect: boolean;
}

export class SaveQuestionDto {
  @ApiProperty({ example: 6, description: "ID của khóa học chứa câu hỏi" })
  @IsInt()
  courseId: number;

  @ApiProperty({ example: 1, description: "ID của bài học chứa câu hỏi" })
  @IsInt()
  lessonId: number;

  @ApiProperty({
    example: "React là thư viện của ngôn ngữ nào?",
    description: "Nội dung câu hỏi",
  })
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @ApiProperty({ example: 3, description: "ID của quiz chứa câu hỏi" })
  @IsInt()
  quizId: number;

  @ApiProperty({
    type: [OptionDto],
    description: "Danh sách các lựa chọn mới (có thể rỗng)",
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  newOptions: OptionDto[];
}
