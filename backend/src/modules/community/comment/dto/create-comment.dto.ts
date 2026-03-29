import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({ example: "This is a comment" })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  postId: number;

  @ApiPropertyOptional({
    example: 2,
    description: "ID of the parent comment if this is a reply",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number;
}
