import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";
import { PaginationQueryDto } from "src/core/dto/pagination-query.dto";
import { v4 as uuidv4 } from "uuid";
import {
  buildOrderBy,
  buildPaginationParams,
  buildPaginationResponse,
  buildSearchFilter,
} from "src/core/helpers/pagination.util";
import { Prisma } from "@prisma/client";

@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCouponDto, instructorId: number) {
    // Kiểm tra quyền instructor
    if (dto.courseId) {
      const course = await this.prisma.course.findUnique({
        where: { id: dto.courseId },
      });
      if (!course) throw new NotFoundException("Khóa học không tồn tại");

      if (course.instructorId !== instructorId) {
        throw new ForbiddenException(
          "Bạn không có quyền tạo coupon cho khóa học này"
        );
      }
    }

    // Kiểm tra expiresAt phải là tương lai
    if (dto.expiresAt) {
      const expiresDate = new Date(dto.expiresAt);
      const now = new Date();

      if (isNaN(expiresDate.getTime())) {
        throw new BadRequestException("Định dạng ngày hết hạn không hợp lệ");
      }

      if (expiresDate <= now) {
        throw new BadRequestException("Ngày hết hạn phải nằm trong tương lai");
      }
    }

    // Tạo mã coupon ngẫu nhiên (UUID)
    const randomId = uuidv4().split("-")[0].toUpperCase();
    const generatedCode = `${dto.code.trim().toUpperCase()}-${randomId}`;

    // Kiểm tra trùng code
    const existing = await this.prisma.coupon.findUnique({
      where: { code: generatedCode },
    });
    if (existing) throw new BadRequestException("Mã coupon đã tồn tại");

    // Tạo coupon mới
    const coupon = await this.prisma.coupon.create({
      data: {
        code: generatedCode,
        percentage: dto.percentage ?? 0,
        maxUsage: dto.maxUsage ?? 0,
        expiresAt: dto.expiresAt ?? null,
        isActive: dto.isActive ?? true,
        courseId: dto.courseId ?? null,
        specializationId: dto.specializationId ?? null,
        createdById: instructorId,
        usedCount: 0,
      },
    });

    return {
      message: "Tạo coupon thành công",
      data: coupon,
    };
  }

  async createCouponDiscountByAdmin(dto: CreateCouponDto, adminId: number) {
    // Bắt buộc phải có discountCampaignId
    if (!dto.discountCampaignId) {
      throw new BadRequestException("discountCampaignId là bắt buộc");
    }

    // Kiểm tra chiến dịch tồn tại
    const campaign = await this.prisma.discountCampaign.findUnique({
      where: { id: dto.discountCampaignId },
    });
    if (!campaign) {
      throw new NotFoundException("Chiến dịch giảm giá không tồn tại");
    }

    // Kiểm tra expiresAt
    if (dto.expiresAt) {
      const expiresDate = new Date(dto.expiresAt);
      if (isNaN(expiresDate.getTime())) {
        throw new BadRequestException("Định dạng ngày hết hạn không hợp lệ");
      }
      const now = new Date();
      if (expiresDate <= now) {
        throw new BadRequestException("Ngày hết hạn phải nằm trong tương lai");
      }
    }

    // Sinh mã coupon ngẫu nhiên
    const randomId = uuidv4().split("-")[0].toUpperCase();
    const generatedCode = `${dto.code.trim().toUpperCase()}-${randomId}`;

    // Kiểm tra trùng code
    const existing = await this.prisma.coupon.findUnique({
      where: { code: generatedCode },
    });
    if (existing) {
      throw new BadRequestException("Mã coupon đã tồn tại");
    }

    // Tạo coupon gắn liền với DiscountCampaign
    const coupon = await this.prisma.coupon.create({
      data: {
        code: generatedCode,
        percentage: dto.percentage ?? 0,
        maxUsage: dto.maxUsage ?? 0,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        isActive: dto.isActive ?? true,
        target: dto.target ?? "ALL",
        createdById: adminId,
        usedCount: 0,

        // bắt buộc gắn campaign
        discountCampaign: {
          connect: { id: dto.discountCampaignId },
        },
      },
      include: {
        discountCampaign: true,
      },
    });

    return {
      message: "Tạo coupon cho chiến dịch thành công",
      data: coupon,
    };
  }

  async findAll(query: PaginationQueryDto) {
    const { skip, take, page, limit } = buildPaginationParams(query);
    const orderBy = buildOrderBy(query);

    // Bộ lọc tìm kiếm (tìm theo code hoặc mô tả)
    const searchFilter = buildSearchFilter<Prisma.CouponWhereInput>(query, [
      "code",
    ]);

    const where = searchFilter ? { ...searchFilter } : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.coupon.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          course: { select: { id: true, title: true } },
          createdBy: { select: { id: true, fullname: true, role: true } },
        },
      }),
      this.prisma.coupon.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async findOne(id: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: {
        course: true,
        createdBy: true,
        couponUsage: {
          include: {
            user: { select: { id: true, fullname: true, email: true } },
          },
        },
      },
    });
    if (!coupon) throw new NotFoundException("Không tìm thấy coupon");
    return coupon;
  }

  async update(id: number, dto: UpdateCouponDto, instructorId: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!coupon) throw new NotFoundException("Không tìm thấy coupon");

    // Chỉ admin hoặc instructor của course được update
    if (coupon.course && coupon.course.instructorId !== instructorId) {
      throw new ForbiddenException("Bạn không có quyền cập nhật coupon này");
    }

    const updated = await this.prisma.coupon.update({
      where: { id },
      data: {
        // Các field được phép cập nhật
        code: dto.code ? dto.code.trim().toUpperCase() : coupon.code,
        percentage: dto.percentage ?? coupon.percentage,
        maxUsage: dto.maxUsage ?? coupon.maxUsage,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : coupon.expiresAt,
        isActive:
          typeof dto.isActive === "boolean" ? dto.isActive : coupon.isActive,
        target: dto.target ?? coupon.target,
        courseId: dto.courseId ?? coupon.courseId,
        specializationId: dto.specializationId ?? coupon.specializationId,

        // Tự động cập nhật updatedAt
        updatedAt: new Date(),
      },
    });

    return { message: "Thay đổi coupon thành công", data: updated };
  }

  async remove(id: number, userId: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!coupon) throw new NotFoundException("Không tìm thấy coupon");

    if (coupon.course && coupon.course.instructorId !== userId) {
      throw new ForbiddenException("Bạn không có quyền xóa coupon này");
    }

    await this.prisma.coupon.delete({ where: { id } });
    return { message: "Xóa coupon thành công" };
  }

  async applyCoupon(userId: number, code: string, courseId: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
      include: { course: true },
    });

    if (!coupon) throw new NotFoundException("Mã coupon không tồn tại");
    if (!coupon.isActive)
      throw new BadRequestException("Coupon đã được sử dụng");

    // Nếu coupon chỉ dành cho 1 course cụ thể → check
    if (coupon.courseId && coupon.courseId !== courseId) {
      throw new BadRequestException(
        "Coupon không thể áp dụng cho khóa học này"
      );
    }

    // Check thời hạn
    const now = new Date();
    if (coupon.expiresAt && coupon.expiresAt < now)
      throw new BadRequestException("Coupon đã hết hạn");

    // Check max usage
    if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage)
      throw new BadRequestException("Coupon đã đạt đến giới hạn sử dụng");

    // Check user đã dùng chưa
    const usedBefore = await this.prisma.couponUsage.findUnique({
      where: { couponId_userId: { couponId: coupon.id, userId } },
    });
    if (usedBefore)
      throw new BadRequestException("Bạn đã sử dụng coupon này trước đó");

    // Tạo record CouponUsage
    await this.prisma.couponUsage.create({
      data: {
        couponId: coupon.id,
        userId,
      },
    });

    // Tăng usedCount
    await this.prisma.coupon.update({
      where: { id: coupon.id },
      data: { usedCount: { increment: 1 } },
    });

    return {
      message: "Áp dụng coupon thành công",
      discountPercent: coupon.percentage,
      courseId: courseId,
    };
  }

  async getCouponsByInstructor(instructorId: number) {
    return this.prisma.coupon.findMany({
      where: { createdById: instructorId },
      orderBy: { createdAt: "desc" },
      include: {
        course: { select: { id: true, title: true } },
        createdBy: { select: { id: true, fullname: true, role: true } },
        specialization: { select: { id: true, name: true } },
      },
    });
  }
}
