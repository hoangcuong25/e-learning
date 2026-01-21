import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateQuizDto {
  @ApiProperty({ example: "Quiz về ReactJS", description: "Tiêu đề quiz" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 1, description: "ID của bài học liên kết" })
  @IsInt()
  lessonId: number;

  @ApiProperty({ example: 1, description: "ID của khóa học" })
  @IsInt()
  courseId: number;
}
