import { BadRequestException, Injectable } from "@nestjs/common";
import { ApplyInstructorDto } from "./dto/apply-instructor.dto";
import { ApplicationStatus, UserRole, NotificationType } from "@prisma/client";
import { MailerService } from "@nestjs-modules/mailer";
import { PrismaService } from "src/core/prisma/prisma.service";
import { NotificationService } from "src/modules/notification/notification.service";

@Injectable()
export class InstructorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly notificationService: NotificationService
  ) {}

  // 🧩 Nộp đơn đăng ký làm giảng viên
  async applyInstructor(userId: number, body: ApplyInstructorDto) {
    const { specializationIds, experience, bio } = body;

    // Kiểm tra người dùng có tồn tại không
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException("Người dùng không tồn tại.");
    }

    // Kiểm tra xem user đã có đơn đang chờ duyệt chưa
    const existingPending = await this.prisma.instructorApplication.findFirst({
      where: { userId, status: ApplicationStatus.PENDING },
    });

    if (existingPending) {
      throw new BadRequestException(
        "Bạn đã có một đơn đăng ký đang chờ duyệt. Vui lòng chờ phản hồi."
      );
    }

    // Kiểm tra danh sách chuyên ngành hợp lệ
    const validSpecs = await this.prisma.specialization.findMany({
      where: { id: { in: specializationIds } },
    });

    if (validSpecs.length !== specializationIds.length) {
      throw new BadRequestException(
        "Một hoặc nhiều chuyên ngành không tồn tại."
      );
    }

    // Tạo đơn đăng ký và liên kết với các chuyên ngành
    const application = await this.prisma.instructorApplication.create({
      data: {
        userId,
        experience,
        bio,
        applicationSpecializations: {
          create: specializationIds.map((id) => ({
            specialization: { connect: { id } },
          })),
        },
      },
      include: {
        applicationSpecializations: {
          include: { specialization: true },
        },
      },
    });

    // Gửi email xác nhận
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Xác nhận gửi đơn ứng tuyển Giảng viên",
      template: "./applicationConfirmation",
      context: {
        user,
        application,
        specializations: application.applicationSpecializations.map(
          (item) => item.specialization.name
        ),
        platformName: "EduConnect",
      },
    });

    return {
      message: "Gửi đơn đăng ký giảng viên thành công!",
      data: application,
    };
  }

  // 🧩 Phê duyệt đơn đăng ký giảng viên
  async approveInstructor(userId: number, applicationId: number) {
    // Tìm người dùng
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        instructorApplications: {
          include: {
            applicationSpecializations: {
              include: { specialization: true },
            },
          },
        },
      },
    });

    if (!user) throw new BadRequestException("Không tìm thấy người dùng.");

    // Lấy đơn đăng ký cụ thể
    const application = await this.prisma.instructorApplication.findUnique({
      where: { id: applicationId, userId },
      include: {
        applicationSpecializations: {
          include: { specialization: true },
        },
      },
    });

    if (!application)
      throw new BadRequestException("Không tìm thấy đơn đăng ký giảng viên.");

    if (application.status !== ApplicationStatus.PENDING)
      throw new BadRequestException("Chỉ có thể phê duyệt đơn đang chờ duyệt.");

    // Cập nhật trạng thái đơn đăng ký
    await this.prisma.instructorApplication.update({
      where: { id: applicationId },
      data: { status: ApplicationStatus.APPROVED },
    });

    // Cập nhật vai trò người dùng
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.INSTRUCTOR },
    });

    // Tạo Instructor Profile
    await this.prisma.instructorProfile.create({
      data: {
        userId,
        bio: application.bio,
        experience: application.experience,
      },
    });

    // Gửi email thông báo phê duyệt
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Đơn ứng tuyển Giảng viên đã được phê duyệt",
      template: "./applicationApproved",
      context: {
        user,
        application,
        specializations: application.applicationSpecializations.map(
          (item) => item.specialization.name
        ),
        platformName: "EduConnect",
        loginUrl: "https://educonnect.com/login",
      },
    });

    // Gửi thông báo phê duyệt
    await this.notificationService.createNotification({
      userId,
      type: NotificationType.APPLICATION_STATUS,
      title: "Đơn đăng ký giảng viên đã được phê duyệt!",
      body: "Chúc mừng! Đơn đăng ký giảng viên của bạn đã được phê duyệt. Bạn có thể bắt đầu tạo và quản lý khóa học.",
      link: "/instructor/dashboard",
    });

    return updatedUser;
  }

  // 🧩 Từ chối đơn đăng ký giảng viên
  async rejectInstructor(userId: number, applicationId: number) {
    // Tìm người dùng
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        instructorApplications: {
          include: {
            applicationSpecializations: {
              include: { specialization: true },
            },
          },
        },
      },
    });

    if (!user) throw new BadRequestException("Không tìm thấy người dùng.");

    // Lấy đơn đăng ký cụ thể
    const application = await this.prisma.instructorApplication.findUnique({
      where: { id: applicationId, userId },
      include: {
        applicationSpecializations: {
          include: { specialization: true },
        },
      },
    });

    if (!application)
      throw new BadRequestException("Không tìm thấy đơn đăng ký giảng viên.");

    if (application.status !== ApplicationStatus.PENDING)
      throw new BadRequestException("Chỉ có thể từ chối đơn đang chờ duyệt.");

    // ⚠️ Cập nhật trạng thái sang bị từ chối
    await this.prisma.instructorApplication.update({
      where: { id: applicationId },
      data: { status: ApplicationStatus.REJECTED },
    });

    // Gửi email thông báo từ chối
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Đơn ứng tuyển Giảng viên đã bị từ chối",
      template: "./applicationRejected",
      context: {
        user,
        application,
        specializations: application.applicationSpecializations.map(
          (item) => item.specialization.name
        ),
        platformName: "EduConnect",
      },
    });

    // Gửi thông báo từ chối
    await this.notificationService.createNotification({
      userId,
      type: NotificationType.APPLICATION_STATUS,
      title: "Đơn đăng ký giảng viên đã bị từ chối",
      body: "Rất tiếc, đơn đăng ký giảng viên của bạn đã bị từ chối. Vui lòng kiểm tra email để biết thêm chi tiết.",
      link: "/instructor/apply",
    });
  }

  // 🧩 Lấy tất cả đơn đăng ký đang chờ duyệt
  async getAllInstructorApplications() {
    const applications = await this.prisma.instructorApplication.findMany({
      where: { status: ApplicationStatus.PENDING },
      include: {
        user: {
          select: { id: true, email: true },
        },
        applicationSpecializations: {
          include: { specialization: true },
        },
      },
    });
    return applications;
  }

  // 🧩 Lấy đơn đăng ký giảng viên của người dùng
  async getInstructorApplicationByUserId(userId: number) {
    return await this.prisma.instructorApplication.findFirst({
      where: { userId, status: ApplicationStatus.PENDING },
      include: {
        user: {
          select: { id: true, email: true },
        },
        applicationSpecializations: {
          include: { specialization: true },
        },
      },
    });
  }
}
