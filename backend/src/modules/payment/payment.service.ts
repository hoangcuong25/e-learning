import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import * as crypto from "crypto";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateDepositDto } from "./dto/create-payment.dto";
import { TransactionType } from "@prisma/client";

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  // Tạo mã QR Sepay (chỉ hiển thị cho người dùng để chuyển tiền)
  private async generateQRCode(amount: number, content: string) {
    const bankAccount = process.env.SEPAY_RECEIVE_ACCOUNT;
    const bankId = process.env.SEPAY_PAYMENT_BANK_ID;

    if (!bankAccount || !bankId) {
      throw new Error("Bank account and bank ID are required");
    }

    const qrString = `https://qr.sepay.vn/img?acc=${bankAccount}&bank=${bankId}&amount=${amount}&des=${encodeURIComponent(
      content
    )}`;

    return {
      qrDataURL: qrString,
      content,
      amount,
      bankAccount,
    };
  }

  // 1) Tạo yêu cầu nạp tiền (DEPOSIT)
  async createDeposit(dto: CreateDepositDto, userId: number) {
    const { amount } = dto;

    if (amount < 10000)
      throw new BadRequestException("Số tiền tối thiểu là 10,000đ");

    const content = `Elearning_UID${userId}_${Date.now()}`;

    // Tạo QR code để user quét chuyển khoản
    const qrData = await this.generateQRCode(amount, content);

    // Lưu giao dịch chờ (pending)
    const payment = await this.prisma.paymentTransaction.create({
      data: {
        userId,
        amount,
        type: "DEPOSIT",
        content,
        bankAccount: qrData.bankAccount,
        qrCode: qrData.qrDataURL,
        status: "PENDING",
      },
    });

    return {
      id: payment.id,
      amount: payment.amount,
      content: payment.content,
      qrCode: payment.qrCode,
      bankAccount: payment.bankAccount,
    };
  }

  //  2) Xử lý Webhook từ Sepay
  async handleSepayWebhook(payload: any) {
    const { transaction_id, amount, description } = payload.data;
    const content = description.trim();

    const payment = await this.prisma.paymentTransaction.findUnique({
      where: { content },
    });

    if (!payment) return "Payment not found";

    if (payment.status === "COMPLETED") return "Already processed";

    const existed = await this.prisma.transaction.findFirst({
      where: { id: transaction_id },
    });
    if (existed) return "Duplicate transaction";

    await this.prisma.$transaction([
      this.prisma.paymentTransaction.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          tranId: transaction_id,
          completedAt: new Date(),
        },
      }),

      this.prisma.transaction.create({
        data: {
          id: transaction_id,
          userId: payment.userId,
          amount,
          type: "DEPOSIT",
          paymentTransactionId: payment.id,
        },
      }),

      this.prisma.user.update({
        where: { id: payment.userId },
        data: { walletBalance: { increment: amount } },
      }),
    ]);

    return "OK";
  }

  // 3) Lịch sử giao dịch của user
  async getUserTransactions(userId: number, type?: TransactionType) {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        ...(type ? { type } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // 4) Admin xem tất cả
  async getAllTransactions() {
    return this.prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // 5) Chi tiết giao dịch
  async getTransactionDetail(id: number, userId: number) {
    const tx = await this.prisma.transaction.findUnique({ where: { id } });

    if (!tx) throw new BadRequestException("Transaction not found");

    if (tx.userId !== userId) throw new ForbiddenException("Not allowed");

    return tx;
  }
}
