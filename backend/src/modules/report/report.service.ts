import { Injectable, ForbiddenException } from "@nestjs/common";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";
import { PrismaService } from "src/core/prisma/prisma.service";
import {
  buildPaginationParams,
  buildPaginationResponse,
} from "src/core/helpers/pagination.util";

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  // User gửi report
  create(dto: CreateReportDto, reporterId: number) {
    return this.prisma.report.create({
      data: {
        ...dto,
        reporterId,
      },
    });
  }

  // Admin xem danh sách report (có filter)
  async findAll(page = 1, limit = 10, status?: string, search?: string) {
    const paginationParams = buildPaginationParams({ page, limit });

    // Logic filter cơ bản
    const statusCondition = status ? { status: status as any } : {};

    // Kết hợp tất cả điều kiện
    const where = {
      AND: [
        statusCondition,
        search
          ? {
              OR: [
                { description: { contains: search } },
                { reporter: { email: { contains: search } } },
                { reporter: { fullname: { contains: search } } },
              ],
            }
          : {},
      ],
    };

    const [data, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        include: {
          reporter: {
            select: {
              id: true,
              fullname: true,
              email: true,
              avatar: true,
            },
          },
        },
        skip: paginationParams.skip,
        take: paginationParams.take,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.report.count({ where }),
    ]);

    return buildPaginationResponse(
      data,
      total,
      paginationParams.page,
      paginationParams.limit
    );
  }

  findOne(id: number) {
    return this.prisma.report.findUnique({
      where: { id },
      include: {
        reporter: {
          select: {
            id: true,
            fullname: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  update(id: number, dto: UpdateReportDto) {
    return this.prisma.report.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.report.delete({ where: { id } });
  }
}
