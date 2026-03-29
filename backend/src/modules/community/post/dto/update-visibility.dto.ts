import { IsEnum } from "class-validator";
import { PostVisibility } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateVisibilityDto {
  @ApiProperty({
    enum: PostVisibility,
    description: "Post visibility",
    example: "PUBLIC",
  })
  @IsEnum(PostVisibility)
  visibility: PostVisibility;
}
