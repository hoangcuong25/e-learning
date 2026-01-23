import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class CreateDepositDto {
  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(10000, { message: "Số tiền tối thiểu là 10.000đ" })
  amount: number;
}
