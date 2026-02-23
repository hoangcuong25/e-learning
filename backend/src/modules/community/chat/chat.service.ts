import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ConversationQueryDto, MessageQueryDto } from "./dto/chat-query.dto";
import { buildPaginationParams } from "src/core/helpers/pagination.util";
import { ChatGateway } from "./chat.gateway";
import { AiService } from "../../ai/ai.service";

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
    private readonly aiService: AiService
  ) {}

  /**
   * Find or create a conversation between two users.
   * Ensures user1Id < user2Id convention.
   */
  async findOrCreateConversation(user1Id: number, user2Id: number) {
    const [u1, u2] =
      user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];

    let conversation = await this.prisma.conversation.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id: u1,
          user2Id: u2,
        },
      },
      include: {
        user1: {
          select: { id: true, fullname: true, avatar: true, email: true },
        },
        user2: {
          select: { id: true, fullname: true, avatar: true, email: true },
        },
      },
    });

    const isNew = !conversation;

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          user1Id: u1,
          user2Id: u2,
        },
        include: {
          user1: {
            select: { id: true, fullname: true, avatar: true, email: true },
          },
          user2: {
            select: { id: true, fullname: true, avatar: true, email: true },
          },
        },
      });
    } else {
      // Re-enable conversation if it was hidden
      if (conversation.hiddenBy1 || conversation.hiddenBy2) {
        await this.prisma.conversation.update({
          where: { id: conversation.id },
          data: {
            hiddenBy1: false,
            hiddenBy2: false,
          },
        });
      }
    }

    // Format for frontend
    const formatted = {
      ...conversation,
      participants: [
        { userId: conversation.user1Id, user: conversation.user1 },
        ...(conversation.user2Id
          ? [{ userId: conversation.user2Id, user: conversation.user2 }]
          : []),
      ],
      user1: undefined,
      user2: undefined,
    };

    return { conversation: formatted, isNew };
  }

  async sendMessage(senderId: number, createMessageDto: CreateMessageDto) {
    const { receiverId, content, messageType } = createMessageDto;

    if (senderId === receiverId) {
      throw new ForbiddenException("Bạn không thể gửi tin nhắn cho chính mình");
    }

    const { conversation, isNew } = await this.findOrCreateConversation(
      senderId,
      receiverId
    );

    const message = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId,
        receiverId: receiverId ?? null,
        content: createMessageDto.content || "",
        isAiResponse: createMessageDto.isAiResponse || false,
        metadata: createMessageDto.metadata || undefined,

        media: createMessageDto.media
          ? {
              create: createMessageDto.media.map((m) => ({
                url: m.url,
                type: m.type,
              })),
            }
          : undefined,
      },
      include: {
        sender: { select: { id: true, fullname: true, avatar: true } },
        receiver: {
          select: { id: true, fullname: true, avatar: true, email: true },
        },
        media: true,
      },
    });

    // Update conversation last message metadata
    let lastMsgText = content;
    if (!lastMsgText && createMessageDto.media?.length) {
      const type = createMessageDto.media[0].type;
      lastMsgText = type === "IMAGE" ? "[Hình ảnh]" : "[Video]";
    }
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: lastMsgText,
        lastSenderId: senderId,
        lastMessageAt: new Date(),
        hiddenBy1: false,
        hiddenBy2: conversation.user2Id ? false : undefined,
      },
    });

    // Real-time: Emit to receiver if it's a real user
    if (message.receiver?.email) {
      this.chatGateway.emitMessageToUser(message.receiver.email, message);

      if (isNew) {
        this.chatGateway.emitNewConversation(
          message.receiver.email,
          conversation
        );
      }
    }

    return message;
  }

  async getConversations(userId: number, query: ConversationQueryDto) {
    const { skip, take } = buildPaginationParams(query);

    const where: any = {
      OR: [
        { user1Id: userId, hiddenBy1: false },
        { user2Id: userId, hiddenBy2: false },
      ],
      lastMessage: { not: null }, // Only show conversations with at least one message
    };

    if (query.type) {
      where.type = query.type;
    } else {
      where.type = { not: "AI" };
    }

    const [conversations, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        skip,
        take,
        orderBy: { lastMessageAt: "desc" },
        include: {
          user1: {
            select: { id: true, fullname: true, avatar: true, email: true },
          },
          user2: {
            select: { id: true, fullname: true, avatar: true, email: true },
          },
        },
      }),
      this.prisma.conversation.count({ where }),
    ]);

    // Fetch unread counts for all these conversations
    const conversationIds = conversations.map((c) => c.id);
    const unreadCounts = await this.prisma.message.groupBy({
      by: ["conversationId"],
      where: {
        conversationId: { in: conversationIds },
        receiverId: userId,
        isRead: false,
      },
      _count: {
        _all: true,
      },
    });

    // Fetch other user's unread counts (messages sent by current user that are unread)
    const otherUnreadCounts = await this.prisma.message.groupBy({
      by: ["conversationId"],
      where: {
        conversationId: { in: conversationIds },
        senderId: userId,
        isRead: false,
      },
      _count: {
        _all: true,
      },
    });

    const unreadMap = unreadCounts.reduce((acc, curr) => {
      acc[curr.conversationId] = curr._count._all;
      return acc;
    }, {});

    const otherUnreadMap = otherUnreadCounts.reduce((acc, curr) => {
      acc[curr.conversationId] = curr._count._all;
      return acc;
    }, {});

    // Format conversations to show the participants array and include unread counts
    const formatted = conversations.map((conv) => {
      return {
        ...conv,
        unreadCount: unreadMap[conv.id] || 0,
        otherUnreadCount: otherUnreadMap[conv.id] || 0,
        participants: [
          { userId: conv.user1Id, user: conv.user1 },
          ...(conv.user2Id ? [{ userId: conv.user2Id, user: conv.user2 }] : []),
        ],
        user1: undefined,
        user2: undefined,
      };
    });

    return {
      data: formatted,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / (query.limit || 20)),
      },
    };
  }

  async getMessages(
    conversationId: number,
    userId: number,
    query: MessageQueryDto
  ) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException("Không tìm thấy cuộc hội thoại");
    }

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      throw new ForbiddenException(
        "Bạn không có quyền truy cập cuộc hội thoại này"
      );
    }

    const { skip, take } = buildPaginationParams(query);

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          sender: {
            select: { id: true, fullname: true, avatar: true },
          },
          media: true,
        },
      }),
      this.prisma.message.count({ where: { conversationId } }),
    ]);

    return {
      data: messages.reverse(), // Return in chronological order for the UI
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / (query.limit || 50)),
      },
    };
  }

  async markAsRead(conversationId: number, userId: number) {
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { success: true };
  }

  async hideConversation(conversationId: number, userId: number) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException("Không tìm thấy cuộc hội thoại");
    }

    const data: any = {};
    if (conversation.user1Id === userId) data.hiddenBy1 = true;
    else if (conversation.user2Id === userId) data.hiddenBy2 = true;
    else
      throw new ForbiddenException("Bạn không có quyền xóa cuộc hội thoại này");

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data,
    });

    return { success: true };
  }

  /**
   * Get or create a conversation with the AI Tutor.
   */
  async getAiConversation(userId: number) {
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        user1Id: userId,
        type: "AI",
        user2Id: null,
      },
      include: {
        user1: {
          select: { id: true, fullname: true, avatar: true, email: true },
        },
      },
    });

    const isNew = !conversation;

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          user1Id: userId,
          type: "AI",
        },
        include: {
          user1: {
            select: { id: true, fullname: true, avatar: true, email: true },
          },
        },
      });
    }

    // Format for frontend
    const formatted = {
      ...conversation,
      participants: [
        { userId: conversation.user1Id, user: conversation.user1 },
      ],
      user1: undefined,
      user2: undefined,
    };

    return { conversation: formatted, isNew };
  }

  async chatWithAi(userId: number, content: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        user1Id: userId,
        type: "AI",
        user2Id: null,
      },
    });

    if (!conversation) {
      throw new NotFoundException("Không tìm thấy cuộc hội thoại");
    }

    // 1. Save user message
    const userMessage = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        receiverId: null,
        content,
        isAiResponse: false,
      },
      include: {
        sender: { select: { id: true, fullname: true, avatar: true } },
      },
    });

    // 2. Update conversation last message
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: content,
        lastSenderId: userId,
        lastMessageAt: new Date(),
      },
    });

    // 3. Generate AI response
    const aiResponse: any = await this.aiService.explainTerm({
      term: content,
      userLevel: "BEGINNER",
      field: "GENERAL IT",
    });

    // 4. Save AI response
    const aiMessage = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userId, // Logic: sender is userId but isAiResponse = true
        receiverId: null,
        content: aiResponse.definition || aiResponse.toString(),
        isAiResponse: true,
        metadata: aiResponse,
      },
      include: {
        sender: { select: { id: true, fullname: true, avatar: true } },
      },
    });

    // 5. Update conversation last message again
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: aiResponse.definition || "AI Response",
        lastSenderId: null, // AI sent it
        lastMessageAt: new Date(),
      },
    });

    return aiMessage;
  }
}
