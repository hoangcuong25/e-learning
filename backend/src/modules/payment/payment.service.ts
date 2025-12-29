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

  private extractContent(raw: string): string | null {
    if (!raw) return null;
    const regex = /Elearning(.*?)\-CHUYEN TIEN/i;
    const match = raw.match(regex);
    return match ? `Elearning${match[1]}`.trim() : null;
  }

  // 1) Tạo yêu cầu nạp tiền (DEPOSIT)
  async createDeposit(dto: CreateDepositDto, userId: number) {
    const { amount } = dto;

    if (amount < 10000)
      throw new BadRequestException("Số tiền tối thiểu là 10,000đ");

    // Kiểm tra xem user đã có giao dịch pending trùng amount chưa
    const existingPending = await this.prisma.paymentTransaction.findFirst({
      where: {
        userId,
        amount,
        type: "DEPOSIT",
        status: "PENDING",
      },
    });

    if (existingPending) {
      // Nếu có rồi thì trả luôn thông tin cũ
      return {
        id: existingPending.id,
        amount: existingPending.amount,
        content: existingPending.content,
        qrCode: existingPending.qrCode,
        bankAccount: existingPending.bankAccount,
        existing: true, // flag để FE biết
      };
    }

    // Nếu chưa có pending, tạo content mới
    const content = `ElearningUID${userId}${Date.now()}`;

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
      existing: false,
    };
  }

  //  2) Xử lý Webhook từ Sepay
  async handleSepayWebhook(payload: any) {
    // Trích xuất dữ liệu gốc từ webhook
    const { transferAmount: amount, content, referenceCode } = payload;
    if (!content) return "Missing description";

    const extractedContent = this.extractContent(content);

    if (!extractedContent) {
      console.warn("Không thể extract content từ webhook:", content);
      return "Invalid content format";
    }

    // Tìm giao dịch pending tương ứng
    const payment = await this.prisma.paymentTransaction.findUnique({
      where: { content: extractedContent },
    });

    if (!payment) {
      console.warn("Payment not found for content:", extractedContent);
      return "Payment not found";
    }

    if (payment.status === "COMPLETED") return "Already processed";

    // Cập nhật trạng thái và cộng tiền
    await this.prisma.$transaction([
      this.prisma.paymentTransaction.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          tranId: referenceCode ?? undefined,
          completedAt: new Date(),
        },
      }),

      this.prisma.transaction.create({
        data: {
          userId: payment.userId,
          amount,
          type: "DEPOSIT",
          paymentTransactionId: payment.id,
          note: `Webhook auto-match: ${extractedContent}`,
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
