import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { SaveQuestionDto } from "./dto/save-question.dto";

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  // ─── TẠO CÂU HỎI ──────────────────────────────
  async create(createQuestionDto: CreateQuestionDto, instructorId: number) {
    const { questionText, quizId } = createQuestionDto;

    // Kiểm tra quiz có tồn tại và thuộc quyền của giảng viên không
    const quiz = await this.prisma.quiz.findFirst({
      where: {
        id: quizId,
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

    if (!quiz)
      throw new ForbiddenException(
        "Bạn không có quyền thêm câu hỏi vào bài kiểm tra này hoặc bài kiểm tra không tồn tại"
      );

    // Tạo câu hỏi mới
    const newQuestion = await this.prisma.question.create({
      data: {
        questionText,
        quizId,
      },
    });

    return {
      message: "Tạo câu hỏi thành công",
      data: newQuestion,
    };
  }

  // ─── LẤY TẤT CẢ CÂU HỎI ──────────────────────────────
  async findAll() {
    return this.prisma.question.findMany({
      include: {
        quiz: true,
        options: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // ─── LẤY MỘT CÂU HỎI ──────────────────────────────
  async findOne(id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        quiz: true,
        options: true,
      },
    });

    if (!question) throw new NotFoundException("Không tìm thấy câu hỏi");

    return question;
  }

  // ─── CẬP NHẬT CÂU HỎI ──────────────────────────────
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
      throw new NotFoundException("Không tìm thấy câu hỏi");
    }

    // Kiểm tra quyền giảng viên
    if (question.quiz.lesson.chapter.course.instructorId !== instructorId) {
      throw new ForbiddenException("Bạn không có quyền chỉnh sửa câu hỏi này");
    }

    return this.prisma.question.update({
      where: { id },
      data: updateQuestionDto,
    });
  }

  // ─── LƯU CÂU HỎI (CẬP NHẬT CẢ OPTIONS) ──────────────────────────────
  async saveQuestion(
    id: number,
    saveQuestionDto: SaveQuestionDto,
    instructorId: number
  ) {
    const { courseId, lessonId, questionText, quizId, newOptions } =
      saveQuestionDto;

    // Kiểm tra câu hỏi có tồn tại và có thuộc quiz của giảng viên này không
    const question = await this.prisma.question.findFirst({
      where: {
        id,
        quizId,
        quiz: {
          lesson: {
            id: lessonId,
            chapter: {
              course: {
                id: courseId,
                instructorId: instructorId,
              },
            },
          },
        },
      },
      include: { options: true },
    });

    if (!question) {
      throw new BadRequestException(
        "Không tìm thấy câu hỏi hoặc bạn không có quyền thao tác"
      );
    }

    // Cập nhật nội dung câu hỏi (nếu có thay đổi)
    if (question.questionText !== questionText) {
      await this.prisma.question.update({
        where: { id },
        data: { questionText },
      });
    }

    // Xóa toàn bộ option cũ
    await this.prisma.option.deleteMany({
      where: { questionId: id },
    });

    // Tạo mới toàn bộ option
    if (newOptions && newOptions.length > 0) {
      await this.prisma.option.createMany({
        data: newOptions.map((opt) => ({
          text: opt.optionText,
          isCorrect: opt.isCorrect,
          questionId: id,
        })),
      });
    }

    // Trả về dữ liệu mới nhất
    return this.prisma.question.findUnique({
      where: { id },
      include: { options: true },
    });
  }

  // ─── XÓA CÂU HỎI ──────────────────────────────
  async remove(id: number, instructorId: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
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
      throw new NotFoundException("Không tìm thấy câu hỏi");
    }

    // Kiểm tra quyền giảng viên
    if (question.quiz.lesson.chapter.course.instructorId !== instructorId) {
      throw new ForbiddenException("Bạn không có quyền xóa câu hỏi này");
    }

    // Xóa câu hỏi (Prisma sẽ tự động xóa các option liên quan nếu có cascade)
    return this.prisma.question.delete({ where: { id } });
  }
}
