import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

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
  quizId: number;
}
