import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { UpdateDiscountDto } from "./dto/update-discount.dto";
import { PaginationQueryDto } from "src/core/dto/pagination-query.dto";
import {
  buildOrderBy,
  buildPaginationParams,
  buildPaginationResponse,
  buildSearchFilter,
} from "src/core/helpers/pagination.util";

@Injectable()
export class DiscountService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDiscountDto, createdById: number) {
    const { title, startsAt, endsAt } = dto;

    // Kiểm tra xem title đã tồn tại chưa
    const existing = await this.prisma.discountCampaign.findFirst({
      where: { title },
    });

    if (existing) {
      throw new BadRequestException(
        "Chiến dịch giảm giá với tiêu đề này đã tồn tại!"
      );
    }

    // Nếu chưa tồn tại thì tạo mới
    return this.prisma.discountCampaign.create({
      data: {
        title,
        description: dto.description,
        percentage: dto.percentage,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        createdById,
      },
    });
  }

  async findAll(query: PaginationQueryDto) {
    // Lấy các tham số phân trang
    const { skip, take, page, limit } = buildPaginationParams(query);

    // Tạo bộ lọc tìm kiếm (theo các trường được phép)
    const searchFilter = buildSearchFilter<any>(query, [
      "title",
      "description",
    ]);

    // Tạo điều kiện truy vấn
    const where = searchFilter ? searchFilter : {};

    // Thứ tự sắp xếp
    const orderBy = buildOrderBy(query);

    // Chạy song song 2 truy vấn để tối ưu hiệu năng
    const [data, total] = await Promise.all([
      this.prisma.discountCampaign.findMany({
        where,
        include: {
          createdBy: { select: { id: true, fullname: true, email: true } },
          coupons: true,
        },
        skip,
        take,
        orderBy,
      }),
      this.prisma.discountCampaign.count({ where }),
    ]);

    // Trả kết quả chuẩn hóa
    return buildPaginationResponse(data, total, page, limit);
  }

  async findOne(id: number) {
    const discount = await this.prisma.discountCampaign.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, fullname: true, email: true } },
        coupons: true,
      },
    });

    if (!discount) {
      throw new NotFoundException("Không tìm thấy chiến dịch giảm giá.");
    }

    return discount;
  }

  async update(id: number, dto: UpdateDiscountDto, updatedById: number) {
    const discount = await this.prisma.discountCampaign.findUnique({
      where: { id },
    });
    if (!discount)
      throw new NotFoundException(
        "Không tìm thấy chiến dịch giảm giá để cập nhật."
      );

    return this.prisma.discountCampaign.update({
      where: { id },
      data: {
        ...dto,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : discount.startsAt,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : discount.endsAt,
      },
    });
  }

  async remove(id: number) {
    const discount = await this.prisma.discountCampaign.findUnique({
      where: { id },
    });
    if (!discount)
      throw new NotFoundException("Không tìm thấy chiến dịch giảm giá để xóa.");

    return this.prisma.discountCampaign.delete({ where: { id } });
  }

  async toggleStatus(id: number) {
    const discount = await this.prisma.discountCampaign.findUnique({
      where: { id },
    });
    if (!discount)
      throw new NotFoundException(
        "Không tìm thấy chiến dịch giảm giá để thay đổi trạng thái."
      );

    return this.prisma.discountCampaign.update({
      where: { id },
      data: { isActive: !discount.isActive },
    });
  }
}
