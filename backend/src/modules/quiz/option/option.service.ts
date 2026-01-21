import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateOptionDto, UpdateOptionDto } from "./dto/create-option.dto";

@Injectable()
export class OptionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOptionDto, instructorId: number) {
    const { text, isCorrect, questionId } = dto;

    // Tìm question → quiz → lesson → course
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: {
        quiz: {
          include: {
            lesson: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!question) throw new NotFoundException("Question not found");

    // Check quyền: instructor phải là chủ course
    if (question.quiz.lesson.course.instructorId !== instructorId) {
      throw new ForbiddenException(
        "You are not allowed to create options for this question"
      );
    }

    // Tạo option
    return this.prisma.option.create({
      data: { text, isCorrect, questionId },
    });
  }

  async createMany(options: CreateOptionDto[], instructorId: number) {
    if (!options.length) {
      throw new Error("Options array cannot be empty");
    }

    // Tìm question → quiz → lesson → course
    const question = await this.prisma.question.findUnique({
      where: { id: options[0].questionId },
      include: {
        quiz: {
          include: {
            lesson: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    // Check quyền: instructor phải là chủ course
    if (question.quiz.lesson.course.instructorId !== instructorId) {
      throw new ForbiddenException(
        "You are not allowed to create options for this question"
      );
    }

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
    if (!option) throw new NotFoundException("Option not found");
    return option;
  }

  async update(id: number, dto: UpdateOptionDto) {
    const option = await this.prisma.option.findUnique({ where: { id } });
    if (!option) throw new NotFoundException("Option not found");

    return this.prisma.option.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const option = await this.prisma.option.findUnique({ where: { id } });
    if (!option) throw new NotFoundException("Option not found");

    return this.prisma.option.delete({ where: { id } });
  }
}
