import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class PaginationQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: "Trang hiện tại (bắt đầu từ 1)",
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: "Số lượng phần tử mỗi trang",
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: "createdAt",
    description: "Trường cần sắp xếp (VD: createdAt, title, viewCount)",
  })
  @IsOptional()
  @IsString()
  sortBy?: string = "createdAt";

  @ApiPropertyOptional({
    example: "desc",
    description: "Thứ tự sắp xếp (asc/desc)",
  })
  @IsOptional()
  @IsString()
  order?: "asc" | "desc" = "desc";

  @ApiPropertyOptional({
    example: "react",
    description: "Từ khóa tìm kiếm (tùy chọn)",
  })
  @IsOptional()
  @IsString()
  search?: string;
}
