import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  // ─── TẠO MỚI ──────────────────────────────
  async create(createQuizDto: CreateQuizDto, instructorId: number) {
    const { title, lessonId, courseId } = createQuizDto;

    //  Kiểm tra khóa học có thuộc về giảng viên hay không
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, instructorId },
    });

    if (!course) {
      throw new BadRequestException(
        "Không tìm thấy khóa học hoặc bạn không có quyền"
      );
    }

    // Kiểm tra bài học có tồn tại và thuộc khóa học này không
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { chapter: true },
    });

    if (!lesson) {
      throw new NotFoundException("Không tìm thấy bài học");
    }

    // Kiểm tra mối quan hệ giữa bài học và khóa học
    if (!lesson.chapter || lesson.chapter.courseId !== courseId) {
      throw new BadRequestException("Bài học không thuộc khóa học này");
    }

    // Tạo mới quiz
    return this.prisma.quiz.create({
      data: {
        title,
        lessonId,
      },
    });
  }

  // ─── LẤY TẤT CẢ ──────────────────────────────
  async findAll() {
    return this.prisma.quiz.findMany({
      include: {
        lesson: true,
        questions: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // ─── LẤY MỘT BẢN GHI ──────────────────────────────
  async findOne(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
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
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) throw new NotFoundException("Không tìm thấy bài kiểm tra");

    return {
      message: "Lấy thông tin bài kiểm tra thành công",
      data: quiz,
    };
  }

  // ─── CẬP NHẬT ──────────────────────────────
  async update(id: number, updateQuizDto: UpdateQuizDto, instructorId: number) {
    const quiz = await this.prisma.quiz.findFirst({
      where: {
        id,
        lesson: {
          chapter: {
            course: {
              instructorId,
            },
          },
        },
      },
      include: {
        lesson: {
          include: {
            chapter: {
              include: { course: true },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new ForbiddenException(
        "Bạn không có quyền cập nhật bài kiểm tra này hoặc bài kiểm tra không tồn tại"
      );
    }

    const updatedQuiz = await this.prisma.quiz.update({
      where: { id },
      data: {
        title: updateQuizDto.title ?? quiz.title,
      },
    });

    return {
      message: "Cập nhật bài kiểm tra thành công",
      data: updatedQuiz,
    };
  }

  // ─── XÓA ──────────────────────────────
  async remove(id: number, instructorId: number) {
    // Tìm quiz theo id và kiểm tra quyền instructor
    const quiz = await this.prisma.quiz.findFirst({
      where: {
        id,
        lesson: {
          chapter: {
            course: {
              instructorId,
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(
        "Không tìm thấy bài kiểm tra hoặc bạn không có quyền xóa nó"
      );
    }

    await this.prisma.quiz.delete({
      where: { id },
    });

    return {
      message: "Xóa bài kiểm tra thành công",
      deletedQuizId: id,
    };
  }

  // ─── LẤY DANH SÁCH QUIZ CỦA GIẢNG VIÊN ──────────────────────────────
  async instructorQuizzes(instructorId: number) {
    // Lấy tất cả bài kiểm tra thuộc các bài học nằm trong khóa học của giảng viên
    return this.prisma.quiz.findMany({
      where: {
        lesson: {
          chapter: {
            course: {
              instructorId,
            },
          },
        },
      },
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
        _count: {
          select: {
            questions: true, // Đếm số lượng câu hỏi trong mỗi bài kiểm tra
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
