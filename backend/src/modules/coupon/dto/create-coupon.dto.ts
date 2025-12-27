import { ApiProperty } from "@nestjs/swagger";
import { CouponTarget } from "@prisma/client";
import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsBoolean,
} from "class-validator";

export class CreateCouponDto {
  @ApiProperty({
    example: "SUMMER50",
    description: "Unique coupon code for users to apply",
  })
  @IsString()
  code: string;

  @ApiProperty({
    example: 50,
    description: "Discount percentage (1–50)",
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  percentage: number;

  @ApiProperty({
    example: 100,
    description: "Maximum number of times this coupon can be used",
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxUsage?: number;

  @ApiProperty({
    example: "2025-12-31T23:59:59Z",
    description: "Expiration date of the coupon (ISO format)",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiProperty({
    example: true,
    description: "Whether the coupon is active or not",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: "ALL",
    description: "Target audience for the coupon: ALL, COURSE, or CATEGORY",
    required: false,
  })
  @IsOptional()
  @IsString()
  target: CouponTarget;

  @ApiProperty({
    example: 12,
    description:
      "Optional course ID if the coupon applies to a specific course",
    required: false,
  })
  @IsOptional()
  @IsInt()
  courseId?: number;

  @ApiProperty({
    example: 12,
    description:
      "Optional specializationId ID if the coupon applies to a specific specializationId",
    required: false,
  })
  @IsOptional()
  @IsInt()
  specializationId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  discountCampaignId?: number;
}
