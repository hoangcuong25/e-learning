import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  // ─── CREATE ──────────────────────────────
  async create(createQuizDto: CreateQuizDto, instructorId) {
    const { title, lessonId, courseId } = createQuizDto;

    const isCourse = await this.prisma.course.findFirst({
      where: { id: courseId, instructorId },
    });

    if (!isCourse) throw new BadRequestException("Không tìm thấy khóa học");

    // Kiểm tra lesson có tồn tại không
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson) throw new NotFoundException("Lesson not found");

    return this.prisma.quiz.create({
      data: {
        title,
        lessonId,
      },
    });
  }

  // ─── GET ALL ──────────────────────────────
  async findAll() {
    return this.prisma.quiz.findMany({
      include: {
        lesson: true,
        questions: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // ─── GET ONE ──────────────────────────────
  async findOne(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            course: true,
          },
        },
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
    if (!quiz) throw new NotFoundException("Quiz not found");
    return quiz;
  }

  // ─── UPDATE ──────────────────────────────
  async update(id: number, updateQuizDto: UpdateQuizDto, instructorId) {
    const quiz = await this.prisma.quiz.findUnique({
      where: {
        id,
        lesson: {
          course: {
            instructorId,
          },
        },
      },
    });
    if (!quiz) throw new NotFoundException("Quiz not found");

    return this.prisma.quiz.update({
      where: { id },
      data: updateQuizDto,
    });
  }

  // ─── DELETE QUIZ ──────────────────────────────
  async remove(id: number, instructorId: number) {
    // Tìm quiz theo id, đồng thời kiểm tra quyền instructor
    const quiz = await this.prisma.quiz.findFirst({
      where: {
        id,
        lesson: {
          course: {
            instructorId,
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(
        "Quiz not found or you don't have permission to delete it"
      );
    }

    // Nếu tìm thấy, xóa quiz
    await this.prisma.quiz.delete({
      where: { id },
    });

    return {
      message: "Quiz deleted successfully",
      deletedQuizId: id,
    };
  }

  // ─── GET INSTRUCTOR QUIZZES ──────────────────────────────
  async instructorQuizzes(instructorId: number) {
    // Lấy tất cả quiz thuộc các lesson nằm trong course của instructor
    return this.prisma.quiz.findMany({
      where: {
        lesson: {
          course: {
            instructorId, // chỉ lấy quiz thuộc các khóa học của instructor này
          },
        },
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        _count: {
          select: {
            questions: true, // đếm số lượng câu hỏi trong mỗi quiz
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
