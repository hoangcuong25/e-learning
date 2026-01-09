import {
  IsArray,
  ArrayNotEmpty,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ApplyInstructorDto {
  @ApiProperty({
    example: [1, 3],
    description: "Danh sách ID các chuyên ngành mà bạn muốn giảng dạy",
  })
  @IsArray()
  @ArrayNotEmpty({ message: "Phải chọn ít nhất một chuyên ngành" })
  @IsInt({ each: true })
  specializationIds: number[];

  @ApiProperty({
    example: "5 năm kinh nghiệm giảng dạy NodeJS và ReactJS",
    required: false,
  })
  @IsString()
  @IsOptional()
  experience?: string;

  @ApiProperty({
    example: "Tôi yêu thích giảng dạy và lập trình web.",
    required: false,
  })
  @IsString()
  @IsOptional()
  bio?: string;
}
