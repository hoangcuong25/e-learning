import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateQuestionDto {
  @ApiProperty({ description: "Content of the question" })
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class CreateAnswerDto {
  @ApiProperty({ description: "Content of the answer" })
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class CreateReplyDto {
  @ApiProperty({ description: "Content of the reply" })
  @IsNotEmpty()
  @IsString()
  content: string;
}
