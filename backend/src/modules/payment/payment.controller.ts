import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  Headers,
  Query,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles, Public, ResponseMessage } from "src/core/decorator/customize";
import { CreateDepositDto } from "./dto/create-payment.dto";
import { TransactionType } from "@prisma/client";

@ApiTags("Payment")
@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // User gửi yêu cầu nạp tiền
  @Post("deposit")
  @ApiOperation({ summary: "Tạo yêu cầu nạp tiền (deposit)" })
  @ApiBearerAuth()
  @ResponseMessage("Deposit request created")
  deposit(@Body() dto: CreateDepositDto, @Req() req) {
    const userId = req.user.id;
    return this.paymentService.createDeposit(dto, userId);
  }

  // Webhook callback từ Sepay
  // Không cần BearerAuth, vì SEP_PAY server gọi
  @Post("webhook")
  @Public()
  @ApiOperation({ summary: "Webhook từ Sepay báo giao dịch thành công" })
  @ResponseMessage("Webhook received")
  handleWebhook(@Body() body: any, @Headers("x-signature") signature: string) {
    return this.paymentService.handleSepayWebhook(body);
  }

  // User xem lịch sử nạp/rút
  @Get("history")
  @ApiBearerAuth()
  @ResponseMessage("Get my transactions")
  @ApiOperation({ summary: "Lấy lịch sử giao dịch của user" })
  getMyHistory(@Req() req, @Query("type") type?: TransactionType) {
    return this.paymentService.getUserTransactions(req.user.id, type);
  }

  // Admin xem tất cả lịch sử
  @Get("admin/all")
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin xem tất cả giao dịch" })
  @ResponseMessage("Get all transactions")
  getAll() {
    return this.paymentService.getAllTransactions();
  }

  // Xem chi tiết giao dịch
  @Get(":id")
  @ApiBearerAuth()
  @ResponseMessage("Get transaction detail")
  @ApiOperation({ summary: "Xem chi tiết giao dịch theo ID" })
  findOne(@Param("id") id: string, @Req() req) {
    return this.paymentService.getTransactionDetail(+id, req.user.id);
  }
}
