import { IsInt, Min, Max, IsString } from "class-validator";

export class CreateRatingDto {
  @IsInt()
  courseId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  text: string;
}
