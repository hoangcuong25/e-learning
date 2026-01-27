import { Injectable, NotFoundException } from "@nestjs/common";
import { NotificationGateway } from "./notification.gateway";
import { Prisma, Notification } from "@prisma/client";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private notificationGateway: NotificationGateway
  ) {}

  async createNotification(data: CreateNotificationDto): Promise<Notification> {
    const notification = await this.prisma.notification.create({
      data,
    });

    const user = await this.prisma.user.findUnique({
      where: { id: notification.userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    this.notificationGateway.sendNotificationToUser(user.email, notification);

    return notification;
  }

  async findAllForUser(
    userId: number,
    cursor?: string,
    limit: number = 10,
    isRead?: boolean
  ) {
    const where: Prisma.NotificationWhereInput = {
      userId,
    };

    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    if (cursor) {
      where.createdAt = {
        lt: new Date(cursor),
      };
    }

    const notifications = await this.prisma.notification.findMany({
      where,
      take: limit + 1,
      orderBy: { createdAt: "desc" },
    });

    const hasMore = notifications.length > limit;

    const data = hasMore ? notifications.slice(0, limit) : notifications;

    const nextCursor =
      data.length > 0 ? data[data.length - 1].createdAt.toISOString() : null;

    return {
      data,
      nextCursor,
      hasMore,
      limit,
    };
  }

  async getUnreadCount(userId: number) {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
    return { unreadCount: count };
  }

  async markAsRead(
    userId: number,
    notificationId: number
  ): Promise<Notification> {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException("Notification not found");
    }

    if (notification.isRead) {
      return notification;
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: number) {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    return { message: "All notifications marked as read" };
  }

  async deleteNotification(userId: number, notificationId: number) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException("Notification not found");
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: "Notification deleted" };
  }
}
