import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateSpecializationDto {
  @ApiProperty({ example: "Web Development" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: "Phát triển ứng dụng web bằng React, Angular, Node.js...",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  desc?: string;
}
