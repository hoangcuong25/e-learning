import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  // ─── CREATE ──────────────────────────────
  async create(createQuestionDto: CreateQuestionDto) {
    const { questionText, quizId } = createQuestionDto;

    // Kiểm tra quiz tồn tại
    const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException("Quiz not found");

    return this.prisma.question.create({
      data: {
        questionText,
        quizId,
      },
    });
  }

  // ─── GET ALL ──────────────────────────────
  async findAll() {
    return this.prisma.question.findMany({
      include: {
        quiz: true,
        options: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // ─── GET ONE ──────────────────────────────
  async findOne(id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        quiz: true,
        options: true,
      },
    });
    if (!question) throw new NotFoundException("Question not found");
    return question;
  }

  // ─── UPDATE ──────────────────────────────
  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundException("Question not found");

    return this.prisma.question.update({
      where: { id },
      data: updateQuestionDto,
    });
  }

  // ─── DELETE ──────────────────────────────
  async remove(id: number) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundException("Question not found");

    return this.prisma.question.delete({ where: { id } });
  }
}
