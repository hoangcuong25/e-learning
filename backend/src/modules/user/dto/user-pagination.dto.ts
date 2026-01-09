import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";
import { PaginationQueryDto } from "src/core/dto/pagination-query.dto";

export class UserPaginationQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: UserRole,
    description: "Lọc theo vai trò (ADMIN, USER, INSTRUCTOR)",
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
