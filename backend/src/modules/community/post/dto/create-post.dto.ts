import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PostVisibility, MediaType } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class PostMediaDto {
  @ApiProperty({ example: "https://example.com/image.jpg" })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ enum: MediaType, example: MediaType.IMAGE })
  @IsEnum(MediaType)
  type: MediaType;
}

export class CreatePostDto {
  @ApiProperty({ example: "This is my first post!" })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    enum: PostVisibility,
    default: PostVisibility.PUBLIC,
    example: PostVisibility.PUBLIC,
  })
  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility = PostVisibility.PUBLIC;

  @ApiPropertyOptional({ type: [PostMediaDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostMediaDto)
  media?: PostMediaDto[];
}
