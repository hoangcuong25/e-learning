import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateSpecializationDto } from "./dto/create-specialization.dto";
import { UpdateSpecializationDto } from "./dto/update-specialization.dto";

@Injectable()
export class SpecializationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSpecializationDto: CreateSpecializationDto) {
    const { name, desc } = createSpecializationDto;

    // Kiểm tra trùng tên
    const existing = await this.prisma.specialization.findUnique({
      where: { name },
    });
    if (existing) {
      throw new BadRequestException("Tên chuyên ngành đã tồn tại");
    }

    const specialization = await this.prisma.specialization.create({
      data: { name },
    });

    return {
      message: "Tạo chuyên ngành thành công",
      data: specialization,
    };
  }

  async findAll() {
    const data = await this.prisma.specialization.findMany({
      orderBy: { createdAt: "desc" },
    });
    return {
      message: "Danh sách chuyên ngành",
      data,
    };
  }

  async findOne(id: number) {
    const specialization = await this.prisma.specialization.findUnique({
      where: { id },
    });
    if (!specialization) {
      throw new NotFoundException("Không tìm thấy chuyên ngành");
    }
    return {
      message: "Chi tiết chuyên ngành",
      data: specialization,
    };
  }

  async update(id: number, updateSpecializationDto: UpdateSpecializationDto) {
    const specialization = await this.prisma.specialization.findUnique({
      where: { id },
    });
    if (!specialization) {
      throw new NotFoundException("Không tìm thấy chuyên ngành");
    }

    const updated = await this.prisma.specialization.update({
      where: { id },
      data: updateSpecializationDto,
    });

    return {
      message: "Cập nhật chuyên ngành thành công",
      data: updated,
    };
  }

  async remove(id: number) {
    const specialization = await this.prisma.specialization.findUnique({
      where: { id },
    });
    if (!specialization) {
      throw new NotFoundException("Không tìm thấy chuyên ngành");
    }

    await this.prisma.specialization.delete({ where: { id } });

    return { message: "Xóa chuyên ngành thành công" };
  }
}
