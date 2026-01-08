import { Injectable, ForbiddenException } from "@nestjs/common";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  // User gửi report
  create(dto: CreateReportDto, userId: number) {
    return this.prisma.courseReport.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  // Admin xem danh sách report (có filter)
  findAll(page = 1, limit = 20, type?: string) {
    return this.prisma.courseReport.findMany({
      where: type ? { type: type as any } : {},
      include: {
        user: true,
        course: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  findOne(id: number) {
    return this.prisma.courseReport.findUnique({
      where: { id },
      include: {
        user: true,
        course: true,
      },
    });
  }

  update(id: number, dto: UpdateReportDto) {
    return this.prisma.courseReport.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.courseReport.delete({ where: { id } });
  }
}
