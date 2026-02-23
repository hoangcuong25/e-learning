import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ExplainTermDto {
  @ApiProperty({ example: "Closure", description: "The term to explain" })
  @IsNotEmpty()
  @IsString()
  term: string;

  @ApiPropertyOptional({
    example: "Beginner",
    description: "User level",
    default: "Beginner",
  })
  @IsOptional()
  @IsString()
  userLevel?: string = "Beginner";

  @ApiPropertyOptional({
    example: "Computer Science",
    description: "The field of the term",
    default: "General IT",
  })
  @IsOptional()
  @IsString()
  field?: string = "General IT";
}
