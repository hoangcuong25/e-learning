import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import axios from "axios";
import * as crypto from "crypto";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateDepositDto } from "./dto/create-payment.dto";
import { TransactionType } from "@prisma/client";

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  // 1) Tạo yêu cầu nạp tiền (DEPOSIT)
  async createDeposit(dto: CreateDepositDto, userId: number) {
    const { amount } = dto;

    if (amount < 10000)
      throw new BadRequestException("Số tiền tối thiểu là 10,000đ");

    const content = `UID${userId}_${Date.now()}`;

    const res = await axios.post(
      "https://api.sepay.vn/v1/transactions/create",
      {
        account_number: process.env.SEPAY_RECEIVE_ACCOUNT,
        amount,
        content,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SEPAY_API_TOKEN}`,
        },
      }
    );

    const { qr_code, account_number } = res.data.data;

    const payment = await this.prisma.paymentTransaction.create({
      data: {
        userId,
        amount,
        type: "DEPOSIT",
        content,
        bankAccount: account_number,
        qrCode: qr_code,
      },
    });

    return payment;
  }

  // 2) Webhook Sepay
  async handleSepayWebhook(payload: any) {
    // Sepay gửi dạng { data: { ... } }
    const { transaction_id, amount, description } = payload.data;
    const content = description.trim();

    // Tìm PaymentTransaction theo content (ghi chú chuyển khoản)
    const payment = await this.prisma.paymentTransaction.findUnique({
      where: { content },
    });

    if (!payment) return "Payment not found";

    // Nếu đã xử lý rồi → bỏ qua (tránh cộng tiền 2 lần)
    if (payment.status === "COMPLETED") return "Already processed";

    // Nếu transaction_id này tồn tại trong Transaction table → bỏ qua duplicate
    const existed = await this.prisma.transaction.findFirst({
      where: { id: transaction_id },
    });
    if (existed) return "Duplicate transaction";

    await this.prisma.$transaction([
      // Cập nhật trạng thái Payment
      this.prisma.paymentTransaction.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          tranId: transaction_id,
          completedAt: new Date(),
        },
      }),

      // Tạo transaction record
      this.prisma.transaction.create({
        data: {
          userId: payment.userId,
          amount,
          type: "DEPOSIT",
          paymentTransactionId: payment.id,
          id: transaction_id,
        },
      }),

      // Cộng tiền vào ví
      this.prisma.user.update({
        where: { id: payment.userId },
        data: { walletBalance: { increment: amount } },
      }),
    ]);

    return "OK";
  }

  // 3) User xem lịch sử

  async getUserTransactions(userId: number, type?: TransactionType) {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        ...(type ? { type: type } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // 4) Admin xem tất cả
  async getAllTransactions(query: any) {
    return this.prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // 5) Xem chi tiết giao dịch
  async getTransactionDetail(id: number, userId: number) {
    const tx = await this.prisma.transaction.findUnique({ where: { id } });

    if (!tx) throw new BadRequestException("Transaction not found");

    // Nếu không phải admin thì không được xem giao dịch của người khác
    if (tx.userId !== userId) throw new ForbiddenException("Not allowed");

    return tx;
  }
}
