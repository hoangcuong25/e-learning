import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../../core/prisma/prisma.service";
import { CreateOptionDto, UpdateOptionDto } from "./dto/create-option.dto";

@Injectable()
export class OptionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOptionDto, instructorId: number) {
    const { text, isCorrect, questionId } = dto;

    // 🧩 Tìm question → quiz → lesson → chapter → course
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: {
        quiz: {
          include: {
            lesson: {
              include: {
                chapter: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException("Không tìm thấy câu hỏi.");
    }

    // 🧩 Kiểm tra quyền giảng viên
    if (question.quiz.lesson.chapter.course.instructorId !== instructorId) {
      throw new ForbiddenException(
        "Bạn không có quyền thêm lựa chọn cho câu hỏi này."
      );
    }

    // 🧩 Tạo option mới
    return this.prisma.option.create({
      data: {
        text,
        isCorrect,
        questionId,
      },
    });
  }

  async createMany(options: CreateOptionDto[], instructorId: number) {
    if (!options.length) {
      throw new BadRequestException("Danh sách lựa chọn không được để trống.");
    }

    const questionId = options[0].questionId;

    // 🧩 Tìm question → quiz → lesson → chapter → course
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: {
        quiz: {
          include: {
            lesson: {
              include: {
                chapter: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException("Không tìm thấy câu hỏi.");
    }

    // 🧩 Kiểm tra quyền giảng viên
    if (question.quiz.lesson.chapter.course.instructorId !== instructorId) {
      throw new ForbiddenException(
        "Bạn không có quyền thêm lựa chọn cho câu hỏi này."
      );
    }

    // 🧩 Tạo nhiều lựa chọn
    return this.prisma.option.createMany({
      data: options.map(({ text, isCorrect, questionId }) => ({
        text,
        isCorrect,
        questionId,
      })),
    });
  }

  async findAll() {
    return this.prisma.option.findMany({ include: { question: true } });
  }

  async findByQuestionId(questionId: number) {
    return this.prisma.option.findMany({ where: { questionId } });
  }

  async findOne(id: number) {
    const option = await this.prisma.option.findUnique({ where: { id } });
    if (!option) throw new NotFoundException("Không tìm thấy lựa chọn.");
    return option;
  }

  async update(id: number, dto: UpdateOptionDto) {
    const option = await this.prisma.option.findUnique({ where: { id } });
    if (!option) throw new NotFoundException("Không tìm thấy lựa chọn.");

    return this.prisma.option.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const option = await this.prisma.option.findUnique({ where: { id } });
    if (!option) throw new NotFoundException("Không tìm thấy lựa chọn.");

    return this.prisma.option.delete({ where: { id } });
  }
}
