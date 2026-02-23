import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class TutorChatDto {
  @ApiPropertyOptional({
    example: 1,
    description: "ID of the lesson for context",
  })
  @IsOptional()
  @IsNumber()
  lessonId?: number;

  @ApiProperty({
    example: "Explain recursion in 2 sentences",
    description: "User's question",
  })
  @IsNotEmpty()
  @IsString()
  question: string;
}
