import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  // ─── CREATE QUESTION ──────────────────────────────
  async create(createQuestionDto: CreateQuestionDto, instructorId: number) {
    const { questionText, quizId } = createQuestionDto;

    // Kiểm tra quiz có tồn tại
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        lesson: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!quiz) throw new NotFoundException("Quiz not found");

    // Kiểm tra quiz có thuộc quyền instructor không
    if (quiz.lesson.course.instructorId !== instructorId) {
      throw new ForbiddenException(
        "You do not have permission to add questions to this quiz"
      );
    }

    // Tạo question
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
  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
    instructorId: number
  ) {
    const question = await this.prisma.question.findUnique({
      where: { id },
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

    if (question.quiz.lesson.course.instructorId !== instructorId) {
      throw new ForbiddenException(
        "You do not have permission to update this question"
      );
    }

    return this.prisma.question.update({
      where: { id },
      data: updateQuestionDto,
    });
  }

  // ─── DELETE ──────────────────────────────
  async remove(id: number, instructorId: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
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

    if (question.quiz.lesson.course.instructorId !== instructorId) {
      throw new ForbiddenException(
        "You do not have permission to delete this question"
      );
    }

    return this.prisma.question.delete({ where: { id } });
  }
}
