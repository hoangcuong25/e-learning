import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import {
  CreateAnswerDto,
  CreateQuestionDto,
  CreateReplyDto,
} from "./dto/create-lesson-discussion.dto";
import { NotificationService } from "src/modules/notification/notification.service";
import { NotificationType } from "@prisma/client";

@Injectable()
export class LessonDiscussionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService
  ) {}

  // ─── CREATE QUESTION ────────────────────────────────
  async createQuestion(
    lessonId: number,
    userId: number,
    dto: CreateQuestionDto
  ) {
    // Kiểm tra lesson tồn tại
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson) throw new NotFoundException("Bài học không tồn tại");

    return this.prisma.lessonQuestion.create({
      data: {
        content: dto.content,
        userId,
        lessonId,
      },
      include: {
        user: true,
        answers: {
          include: {
            user: true,
            replies: { include: { user: true } },
          },
        },
      },
    });
  }

  // ─── GET QUESTIONS BY LESSON ─────────────────────────
  async getQuestions(lessonId: number) {
    return this.prisma.lessonQuestion.findMany({
      where: { lessonId },
      include: {
        user: true,
        answers: {
          include: {
            user: true,
            replies: {
              include: { user: true },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // ─── CREATE ANSWER ────────────────────────────────
  async createAnswer(questionId: number, userId: number, dto: CreateAnswerDto) {
    const question = await this.prisma.lessonQuestion.findUnique({
      where: { id: questionId },
      include: { lesson: { include: { chapter: true } } },
    });
    if (!question) throw new NotFoundException("Câu hỏi không tồn tại");

    const answer = await this.prisma.lessonAnswer.create({
      data: {
        content: dto.content,
        userId,
        questionId,
      },
      include: { user: true, replies: { include: { user: true } } },
    });

    // Gửi thông báo cho người đặt câu hỏi nếu người trả lời không phải là chính họ
    if (question.userId !== userId) {
      await this.notificationService.createNotification({
        userId: question.userId,
        title: "Câu hỏi của bạn có câu trả lời mới",
        type: NotificationType.LESSON_DISCUSSION,
        body: `${answer.user.fullname} đã trả lời câu hỏi của bạn.`,
        link: `/learn/${question.lesson.chapter.courseId}`,
        actorId: userId,
      });
    }

    return answer;
  }

  // ─── CREATE REPLY ────────────────────────────────
  async createReply(answerId: number, userId: number, dto: CreateReplyDto) {
    const parent = await this.prisma.lessonAnswer.findUnique({
      where: { id: answerId },
      include: {
        question: { include: { lesson: { include: { chapter: true } } } },
      },
    });
    if (!parent) throw new NotFoundException("Câu trả lời không tồn tại");

    const reply = await this.prisma.lessonAnswer.create({
      data: {
        content: dto.content,
        userId,
        questionId: parent.questionId,
        parentId: answerId,
      },
      include: { user: true },
    });

    // Gửi thông báo cho người viết câu trả lời gốc nếu người phản hồi không phải là chính họ
    if (parent.userId !== userId) {
      await this.notificationService.createNotification({
        userId: parent.userId,
        type: NotificationType.LESSON_DISCUSSION,
        title: "Câu trả lời của bạn có phản hồi mới",
        body: `${reply.user.fullname} đã phản hồi câu trả lời của bạn.`,
        link: `/learn/${parent.question.lesson.chapter.courseId}`,
        actorId: userId,
      });
    }

    return reply;
  }

  // ─── DELETE QUESTION ────────────────────────────────
  async deleteQuestion(id: number) {
    const question = await this.prisma.lessonQuestion.findUnique({
      where: { id },
    });
    if (!question) throw new NotFoundException("Câu hỏi không tồn tại");

    return this.prisma.lessonQuestion.delete({ where: { id } });
  }

  // ─── DELETE ANSWER / REPLY ─────────────────────────
  async deleteAnswer(id: number) {
    const answer = await this.prisma.lessonAnswer.findUnique({ where: { id } });
    if (!answer) throw new NotFoundException("Câu trả lời không tồn tại");

    return this.prisma.lessonAnswer.delete({ where: { id } });
  }
  // ─── DELETE MY QUESTION ─────────────────────────────
  async deleteMyQuestion(id: number, userId: number) {
    const question = await this.prisma.lessonQuestion.findUnique({
      where: { id },
    });
    if (!question) throw new NotFoundException("Câu hỏi không tồn tại");
    if (question.userId !== userId) {
      throw new ForbiddenException("Bạn chỉ có thể xóa câu hỏi của chính mình");
    }

    return this.prisma.lessonQuestion.delete({ where: { id } });
  }

  // ─── DELETE MY ANSWER / REPLY ──────────────────────
  async deleteMyAnswer(id: number, userId: number) {
    const answer = await this.prisma.lessonAnswer.findUnique({ where: { id } });
    if (!answer) throw new NotFoundException("Câu trả lời không tồn tại");
    if (answer.userId !== userId) {
      throw new ForbiddenException(
        "Bạn chỉ có thể xóa câu trả lời của chính mình"
      );
    }

    return this.prisma.lessonAnswer.delete({ where: { id } });
  }
}
