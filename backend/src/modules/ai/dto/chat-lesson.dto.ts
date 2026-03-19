import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChatLessonDto {
  @ApiProperty({ example: "Biến cục bộ khác gì biến toàn cục?" })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  lessonId: number;
}
