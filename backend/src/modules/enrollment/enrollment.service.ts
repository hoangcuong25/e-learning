import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  // ─── ĐĂNG KÝ KHÓA HỌC ──────────────────────────────
  async enrollCourse(courseId: number, userId: number, couponCode?: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: true },
    });

    if (!course || !course.isPublished) {
      throw new NotFoundException(
        "Khóa học không tồn tại hoặc chưa được xuất bản"
      );
    }

    if (course.instructorId === userId) {
      throw new BadRequestException(
        "Giảng viên không thể đăng ký khóa học của chính mình"
      );
    }

    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existing) {
      throw new BadRequestException("Bạn đã đăng ký khóa học này rồi");
    }

    let coupon = null;
    let finalPrice = course.price;

    // Nếu có mã giảm giá
    if (couponCode) {
      coupon = await this.prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (!coupon || !coupon.isActive) {
        throw new BadRequestException(
          "Mã giảm giá không hợp lệ hoặc đã bị vô hiệu"
        );
      }

      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new BadRequestException("Mã giảm giá đã hết hạn");
      }

      // Kiểm tra đối tượng áp dụng
      if (coupon.target === "COURSE" && coupon.courseId !== courseId) {
        throw new BadRequestException(
          "Mã giảm giá không áp dụng cho khóa học này"
        );
      }

      if (coupon.target === "SPECIALIZATION") {
        const courseSpec = await this.prisma.courseSpecialization.findMany({
          where: { courseId },
        });
        const specializationIds = courseSpec.map((s) => s.specializationId);
        if (!specializationIds.includes(coupon.specializationId)) {
          throw new BadRequestException(
            "Mã giảm giá không áp dụng cho chuyên ngành này"
          );
        }
      }

      // Tính giá sau giảm
      finalPrice = finalPrice * (1 - coupon.percentage / 100);
    }

    // Nếu khóa học miễn phí => đăng ký ngay
    if (course.type === "FREE" || finalPrice <= 0) {
      return this.prisma.enrollment.create({
        data: {
          userId,
          courseId,
          couponId: coupon?.id,
          progress: 0,
        },
      });
    }

    // Nếu là khóa học trả phí => kiểm tra số dư ví
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user.walletBalance < finalPrice) {
      throw new BadRequestException(
        "Số dư ví không đủ để đăng ký khóa học này"
      );
    }

    // Trừ tiền, lưu lịch sử giao dịch + tạo bản ghi enrollment
    return await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: finalPrice } },
      });

      await tx.transaction.create({
        data: {
          userId,
          amount: -finalPrice,
          type: "COURSE_PURCHASE",
          note: `Đăng ký khóa học #${courseId}`,
        },
      });

      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
        await tx.couponUsage.create({
          data: { userId, couponId: coupon.id },
        });
      }

      return await tx.enrollment.create({
        data: {
          userId,
          courseId,
          couponId: coupon?.id,
          progress: 0,
        },
      });
    });
  }

  // ─── LẤY DANH SÁCH KHÓA HỌC CỦA TÔI ──────────────────────────────
  async getMyEnrollments(userId: number) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            _count: {
              select: {
                chapter: true, // Đếm số Chapter
              },
            },
            instructor: {
              select: { id: true, fullname: true, avatar: true },
            },
            specializations: {
              include: {
                specialization: { select: { name: true } },
              },
            },
            chapter: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });
  }

  // ─── XEM CHI TIẾT MỘT ENROLLMENT ──────────────────────────────
  async getEnrollmentDetail(id: number, userId: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        course: { include: { instructor: true } },
        coupon: true,
      },
    });

    if (!enrollment)
      throw new NotFoundException("Không tìm thấy thông tin đăng ký");
    if (enrollment.userId !== userId)
      throw new ForbiddenException("Bạn không có quyền xem thông tin này");

    return enrollment;
  }

  // ─── GIẢNG VIÊN: LẤY DANH SÁCH HỌC VIÊN TRONG KHÓA ──────────────────────────────
  async getStudentsInCourse(courseId: number, instructorId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course || course.instructorId !== instructorId) {
      throw new ForbiddenException(
        "Bạn không có quyền truy cập vào khóa học này"
      );
    }

    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: { id: true, fullname: true, email: true, avatar: true },
        },
      },
    });
  }

  // ─── HỦY ĐĂNG KÝ KHÓA HỌC ──────────────────────────────
  async cancelEnrollment(id: number, userId: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });

    if (!enrollment || enrollment.userId !== userId)
      throw new ForbiddenException("Bạn không thể hủy đăng ký này");

    // (Có thể mở rộng logic: chỉ cho hủy nếu khóa học miễn phí hoặc chưa bắt đầu)
    return this.prisma.enrollment.delete({ where: { id } });
  }
}
