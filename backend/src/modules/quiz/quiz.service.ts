import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../core/prisma/prisma.service";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import OpenAI from "openai";

@Injectable()
export class QuizService {
  private readonly logger = new Logger(QuizService.name);
  private groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

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
  async findOne(id: number, userId: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                course: {
                  include: {
                    instructor: true,
                    enrollments: {
                      where: { userId },
                      select: { id: true },
                    },
                  },
                },
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

    if (!quiz) {
      throw new NotFoundException("Không tìm thấy bài kiểm tra");
    }

    const course = quiz.lesson.chapter.course;

    // Nếu là instructor của course → bỏ qua kiểm tra enrollments
    if (course.instructorId !== userId) {
      // Nếu không phải instructor thì phải có enrollment
      if (course.enrollments.length === 0) {
        throw new NotFoundException("Không có quyền truy cập");
      }
    }

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

  // ─── SINH CÂU HỎI TỰ ĐỘNG BẰNG AI ──────────────────────────────
  async generateQuestionsFromAi(quizId: number, instructorId: number) {
    // 1. Kiểm tra quyền instructor với quiz này
    const quiz = await this.prisma.quiz.findFirst({
      where: {
        id: quizId,
        lesson: { chapter: { course: { instructorId } } },
      },
      include: {
        lesson: {
          select: {
            id: true,
            transcript: true,
            chunks: { select: { content: true }, take: 20 },
          },
        },
        questions: {
          select: { questionText: true }, // Lấy danh sách câu hỏi đã có
        },
      },
    });

    if (!quiz) {
      throw new ForbiddenException(
        "Không tìm thấy bài kiểm tra hoặc bạn không có quyền truy cập"
      );
    }

    // 2. Lấy ngữ cảnh bài học
    const lesson = quiz.lesson;
    let context = "";

    if (lesson.transcript && lesson.transcript.length > 100) {
      context = lesson.transcript.substring(0, 4000);
    } else if (lesson.chunks && lesson.chunks.length > 0) {
      context = lesson.chunks
        .map((c) => c.content)
        .join("\n\n")
        .substring(0, 4000);
    }

    if (!context) {
      throw new BadRequestException(
        "Bài học này chưa có nội dung AI. Hãy chờ hệ thống xử lý video xong."
      );
    }

    // 3. Chuẩn bị danh sách câu hỏi cũ để tránh trùng lặp
    const existingQuestions = quiz.questions.map(q => q.questionText).join("\n- ");
    const avoidanceInstruction = existingQuestions 
      ? `\n\nCÁC CÂU HỎI ĐÃ CÓ (TUYỆT ĐỐI KHÔNG ĐƯỢC TRÙNG LẶP HOẶC TƯƠNG TỰ):\n- ${existingQuestions}`
      : "";

    // 4. Gọi Groq để sinh câu hỏi
    this.logger.log(`Generating AI questions for quiz ${quizId}...`);

    const systemPrompt = `Bạn là chuyên gia giáo dục. Dựa vào nội dung bài giảng được cung cấp, hãy tạo đúng 5 câu hỏi trắc nghiệm bằng tiếng Việt.
Yêu cầu:
- Mỗi câu hỏi có đúng 4 lựa chọn (A, B, C, D).
- Chỉ có 1 đáp án đúng.
- Câu hỏi phải bám sát nội dung bài giảng.
- TUYỆT ĐỐI KHÔNG tạo lại những câu hỏi đã có sẵn trong danh sách phía dưới (nếu có).
- Hãy khai thác những kiến thức khác trong bài giảng để đảm bảo sự đa dạng và không bị lặp nội dung.
- Trả về ĐÚNG định dạng JSON sau, KHÔNG có bất kỳ text nào khác:
[{"content":"Câu hỏi?","options":[{"text":"Đáp án A","isCorrect":true},{"text":"Đáp án B","isCorrect":false},{"text":"Đáp án C","isCorrect":false},{"text":"Đáp án D","isCorrect":false}]}]`;

    const completion = await this.groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Nội dung bài giảng:\n\n${context}${avoidanceInstruction}` },
      ],
      temperature: 0.7,
    });

    let rawContent = completion.choices[0]?.message?.content || "[]";

    // 4. Parse JSON
    let parsedQuestions: {
      content: string;
      options: { text: string; isCorrect: boolean }[];
    }[];
    try {
      const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
      rawContent = jsonMatch ? jsonMatch[0] : rawContent;
      parsedQuestions = JSON.parse(rawContent);
    } catch {
      this.logger.error("Failed to parse AI response:", rawContent);
      throw new BadRequestException(
        "AI trả về dữ liệu không hợp lệ. Vui lòng thử lại."
      );
    }

    // 5. Trả về câu hỏi (không lưu vào DB để người dùng tự duyệt)
    this.logger.log(
      `Generated ${parsedQuestions.length} questions for quiz ${quizId} (preview mode)`
    );

    return {
      message: `Đã tạo ${parsedQuestions.length} câu hỏi bằng AI thành công. Hãy kiểm tra và lưu lại.`,
      data: parsedQuestions,
    };
  }
}
