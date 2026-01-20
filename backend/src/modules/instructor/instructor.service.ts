import { BadRequestException, Injectable } from "@nestjs/common";

import { ApplyInstructorDto } from "./dto/apply-instructor.dto";
import { ApplicationStatus, UserRole } from "@prisma/client";
import { MailerService } from "@nestjs-modules/mailer";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class InstructorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService
  ) {}

  async applyInstructor(userId: number, body: ApplyInstructorDto) {
    const { specializationIds, experience, bio } = body;

    // 1️. Kiểm tra người dùng có tồn tại không
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException("Người dùng không tồn tại");
    }

    // 2️. Kiểm tra xem user đã có đơn đang chờ duyệt chưa
    const existingPending = await this.prisma.instructorApplication.findFirst({
      where: { userId, status: ApplicationStatus.PENDING },
    });

    if (existingPending) {
      throw new BadRequestException(
        "Bạn đã có một đơn đăng ký đang chờ duyệt. Vui lòng chờ phản hồi."
      );
    }

    // 3️. Kiểm tra danh sách chuyên ngành hợp lệ
    const validSpecs = await this.prisma.specialization.findMany({
      where: { id: { in: specializationIds } },
    });

    if (validSpecs.length !== specializationIds.length) {
      throw new BadRequestException(
        "Một hoặc nhiều chuyên ngành không tồn tại"
      );
    }

    // 4️. Tạo đơn đăng ký và gắn nhiều chuyên ngành
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

    // 5️. Gửi email xác nhận
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Xác nhận gửi đơn ứng tuyển Giảng viên",
      template: "./applicationConfirmation", // không cần đuôi .hbs
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
      message: "Gửi đơn đăng ký giảng viên thành công",
      data: application,
    };
  }

  async approveInstructor(userId: number, applicationId: number) {
    // 1️. Tìm user
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

    if (!user) throw new BadRequestException("User not found");

    // 2. Cập nhật trạng thái đơn đăng ký
    const application = await this.prisma.instructorApplication.findUnique({
      where: { id: applicationId, userId },
      include: {
        applicationSpecializations: {
          include: { specialization: true },
        },
      },
    });

    if (!application)
      throw new BadRequestException("Instructor application not found");

    if (application.status !== ApplicationStatus.PENDING)
      throw new BadRequestException(
        "Only pending applications can be approved"
      );

    await this.prisma.instructorApplication.update({
      where: { id: applicationId },
      data: { status: ApplicationStatus.APPROVED },
    });

    // 3. Cập nhật vai trò (role)
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.INSTRUCTOR },
    });

    // 4. Gửi email thông báo phê duyệt
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Đơn ứng tuyển Giảng viên đã được phê duyệt",
      template: "./applicationApproved", // không cần .hbs
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

    return updatedUser;
  }

  async rejectInstructor(userId: number, applicationId: number) {
    // 1️. Tìm user
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

    if (!user) throw new BadRequestException("User not found");

    // 2. Cập nhật trạng thái đơn đăng ký
    const application = await this.prisma.instructorApplication.findUnique({
      where: { id: applicationId, userId },
      include: {
        applicationSpecializations: {
          include: { specialization: true },
        },
      },
    });

    if (!application)
      throw new BadRequestException("Instructor application not found");

    if (application.status !== ApplicationStatus.PENDING)
      throw new BadRequestException(
        "Only pending applications can be approved"
      );

    await this.prisma.instructorApplication.update({
      where: { id: applicationId },
      data: { status: ApplicationStatus.APPROVED },
    });

    // 3. Gửi email thông báo từ chối
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Đơn ứng tuyển Giảng viên đã được phê duyệt",
      template: "./applicationRejected", // không cần .hbs
      context: {
        user,
        application,
        specializations: application.applicationSpecializations.map(
          (item) => item.specialization.name
        ),
        platformName: "EduConnect",
      },
    });
  }

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
