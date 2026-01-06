import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class EnrollmentService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService
  ) {}

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
    const newEnrollment = await this.prisma.$transaction(async (tx) => {
      // 1. Trừ tiền từ ví người dùng
      await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: finalPrice } },
      });

      // 2. Tạo transaction cho người mua
      const purchaseTransaction = await tx.transaction.create({
        data: {
          userId,
          amount: -finalPrice,
          type: "COURSE_PURCHASE",
          note: `Đăng ký khóa học #${courseId}`,
        },
      });

      // 3. Tính chiết khấu 20% cho giảng viên
      const instructorEarningAmount = finalPrice * 0.8;

      // 4. Cộng tiền vào ví giảng viên
      await tx.user.update({
        where: { id: course.instructorId },
        data: { walletBalance: { increment: instructorEarningAmount } },
      });

      // 5. Tạo transaction cho giảng viên
      const instructorTransaction = await tx.transaction.create({
        data: {
          userId: course.instructorId,
          amount: instructorEarningAmount,
          type: "COURSE_PURCHASE",
          note: `Thu nhập từ khóa học #${courseId} (20% phí)`,
        },
      });

      // 6. Tạo bản ghi InstructorEarning
      await tx.instructorEarning.create({
        data: {
          instructorId: course.instructorId,
          courseId,
          amount: instructorEarningAmount,
          type: "COURSE_PURCHASE",
          transactionId: instructorTransaction.id,
        },
      });

      // 7. Xử lý coupon nếu có
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
        await tx.couponUsage.create({
          data: { userId, couponId: coupon.id },
        });
      }

      // 8. Tạo enrollment
      return await tx.enrollment.create({
        data: {
          userId,
          courseId,
          couponId: coupon?.id,
          progress: 0,
        },
      });
    });

    await this.notificationService.createNotification({
      userId: userId,
      title: "Đăng ký khóa học thành công!",
      body: `Bạn đã mua và đăng ký thành công khóa học **${course.title}** với giá ${finalPrice.toLocaleString()} VND.`,
      type: "ENROLLMENT",
      link: `/learn/${courseId}`,
    });

    // Thông báo cho giảng viên về thu nhập mới
    const instructorEarningAmount = finalPrice * 0.2;
    await this.notificationService.createNotification({
      userId: course.instructorId,
      title: "Thu nhập mới từ khóa học!",
      body: `Bạn đã nhận được ${instructorEarningAmount.toLocaleString()} VND (20% phí) từ khóa học **${course.title}**.`,
      type: "WALLET",
      link: `/instructor/earnings`,
    });

    return newEnrollment;
  }

  // ─── LẤY DANH SÁCH KHÓA HỌC CỦA TÔI ──────────────────────────────
  async getMyEnrollments(userId: number) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            averageRating: true,
            totalRating: true,
            thumbnail: true,

            _count: {
              select: {
                chapter: true,
                courseView: true,
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
              include: { lessons: true },
            },

            courseRating: {
              where: { userId },
              select: {
                id: true,
                rating: true,
                userId: true,
                createdAt: true,
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

    return this.prisma.enrollment.delete({ where: { id } });
  }

  // ─── HOÀN TIỀN KHÓA HỌC ──────────────────────────────
  async refundEnrollment(enrollmentId: number, userId: number) {
    // 1. Lấy thông tin enrollment
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: { instructor: true },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException("Không tìm thấy thông tin đăng ký");
    }

    if (enrollment.userId !== userId) {
      throw new ForbiddenException("Bạn không có quyền hoàn tiền đăng ký này");
    }

    // 2. Kiểm tra khóa học có phải là khóa trả phí không
    if (enrollment.course.type === "FREE") {
      throw new BadRequestException(
        "Không thể hoàn tiền cho khóa học miễn phí"
      );
    }

    // 3. Kiểm tra thời gian đăng ký (phải trong vòng 1 tiếng)
    const now = new Date();
    const enrolledAt = new Date(enrollment.enrolledAt);
    const hoursSinceEnrollment =
      (now.getTime() - enrolledAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceEnrollment > 1) {
      throw new BadRequestException(
        "Chỉ có thể hoàn tiền trong vòng 1 tiếng sau khi đăng ký"
      );
    }

    // 4. Kiểm tra tiến độ học (phải dưới 20%)
    if (enrollment.progress > 20) {
      throw new BadRequestException(
        "Không thể hoàn tiền khi tiến độ học vượt quá 20%"
      );
    }

    // 5. Tìm transaction gốc để lấy số tiền đã trả
    const originalTransaction = await this.prisma.transaction.findFirst({
      where: {
        userId,
        type: "COURSE_PURCHASE",
        note: { contains: `#${enrollment.courseId}` },
        createdAt: {
          gte: new Date(enrolledAt.getTime() - 5000), // 5 giây trước khi enroll
          lte: new Date(enrolledAt.getTime() + 5000), // 5 giây sau khi enroll
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!originalTransaction) {
      throw new NotFoundException("Không tìm thấy giao dịch mua khóa học gốc");
    }

    const refundAmount = Math.abs(originalTransaction.amount) * 0.8; // 80%

    // 6. Thực hiện hoàn tiền
    await this.prisma.$transaction(async (tx) => {
      // 6.1. Hoàn tiền cho người dùng
      await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { increment: refundAmount } },
      });

      // 6.2. Tạo transaction hoàn tiền cho người dùng
      await tx.transaction.create({
        data: {
          userId,
          amount: refundAmount,
          type: "COURSE_REFUND",
          note: `Hoàn tiền khóa học #${enrollment.courseId}`,
        },
      });

      // 6.3. Trừ tiền từ ví giảng viên
      await tx.user.update({
        where: { id: enrollment.course.instructorId },
        data: { walletBalance: { decrement: refundAmount } },
      });

      // 6.4. Tạo transaction hoàn tiền cho giảng viên
      const instructorRefundTransaction = await tx.transaction.create({
        data: {
          userId: enrollment.course.instructorId,
          amount: -refundAmount,
          type: "COURSE_REFUND",
          note: `Hoàn tiền khóa học #${enrollment.courseId} (trừ thu nhập)`,
        },
      });

      // 6.5. Tạo bản ghi InstructorEarning âm
      await tx.instructorEarning.create({
        data: {
          instructorId: enrollment.course.instructorId,
          courseId: enrollment.courseId,
          amount: -refundAmount,
          type: "COURSE_REFUND",
          transactionId: instructorRefundTransaction.id,
        },
      });

      // 6.6. Xóa enrollment
      await tx.enrollment.delete({
        where: { id: enrollmentId },
      });

      // 6.7. Xóa lesson progress liên quan
      await tx.lessonProgress.deleteMany({
        where: {
          userId,
          courseId: enrollment.courseId,
        },
      });
    });

    // 7. Gửi thông báo cho người dùng
    await this.notificationService.createNotification({
      userId,
      title: "Hoàn tiền thành công!",
      body: `Bạn đã được hoàn ${refundAmount.toLocaleString()} VND cho khóa học **${enrollment.course.title}**.`,
      type: "WALLET",
      link: `/wallet`,
    });

    // 8. Gửi thông báo cho giảng viên
    await this.notificationService.createNotification({
      userId: enrollment.course.instructorId,
      title: "Thông báo hoàn tiền",
      body: `Học viên đã yêu cầu hoàn tiền cho khóa học **${enrollment.course.title}**. Số tiền ${refundAmount.toLocaleString()} VND đã được trừ khỏi ví của bạn.`,
      type: "WALLET",
      link: `/instructor/earnings`,
    });

    return {
      message: "Hoàn tiền thành công",
      refundAmount,
    };
  }

  async getCourseProgress(courseId: number, userId: number) {
    const courseProgress = await this.prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
      },
      select: {
        progress: true,
        completedAt: true,
      },
    });

    return courseProgress;
  }

  async recalculateProgress(userId: number, courseId: number) {
    // 1. Lấy tổng số bài học (Lesson) trong Khóa học này
    const totalLessons = await this.prisma.lesson.count({
      where: {
        chapter: {
          courseId: courseId, // Chỉ lấy lesson thuộc course này
        },
      },
    });

    if (totalLessons === 0) {
      // Nếu không có bài học nào, tiến độ mặc định là 100%
      await this.updateEnrollmentProgress(userId, courseId, 100, true);
      return;
    }

    // 2. Đếm số bài học ĐÃ HOÀN THÀNH (LessonProgress)
    const completedLessonsCount = await this.prisma.lessonProgress.count({
      where: {
        userId: userId,
        courseId: courseId,
        isCompleted: true,
      },
    });

    // 3. Tính toán Tiến độ (%)
    let progressPercentage = (completedLessonsCount / totalLessons) * 100;

    // Làm tròn đến 2 chữ số thập phân
    progressPercentage = parseFloat(progressPercentage.toFixed(2));

    const isCompleted = progressPercentage >= 100;

    // 4. Cập nhật bản ghi Enrollment
    await this.updateEnrollmentProgress(
      userId,
      courseId,
      progressPercentage,
      isCompleted
    );

    return {
      progress: progressPercentage,
      completedCount: completedLessonsCount,
    };
  }

  private async updateEnrollmentProgress(
    userId: number,
    courseId: number,
    progress: number,
    isCompleted: boolean
  ) {
    const dataToUpdate: any = {
      progress: progress,
    };

    if (isCompleted) {
      dataToUpdate.completedAt = new Date();
    } else {
      // Nếu không hoàn thành 100%, đảm bảo completedAt là null (nếu có)
      dataToUpdate.completedAt = null;
    }

    return this.prisma.enrollment.update({
      where: {
        // Sử dụng unique index của Enrollment
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: dataToUpdate,
    });
  }
}
