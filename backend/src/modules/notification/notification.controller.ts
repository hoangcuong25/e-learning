import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Req,
} from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { FindNotificationsQueryDto } from "./dto/find-notifications-query.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseMessage } from "src/core/decorator/customize";

@ApiTags("Notifications")
@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get all notifications with cursor-based pagination and filter",
  })
  @ResponseMessage("Get all notifications")
  findAll(@Req() req, @Query() query: FindNotificationsQueryDto) {
    const { cursor, limit, isRead } = query;
    return this.notificationService.findAllForUser(
      req.user.id,
      cursor,
      limit,
      isRead
    );
  }

  @Get("count")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get unread notifications count" })
  @ResponseMessage("Get unread count")
  getUnreadCount(@Req() req) {
    return this.notificationService.getUnreadCount(req.user.id);
  }

  @Patch("read-all")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark all notifications as read" })
  @ResponseMessage("Mark all notifications as read")
  markAllAsRead(@Req() req) {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @Patch(":id/read")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark a notification as read by ID" })
  @ResponseMessage("Mark notification as read")
  markAsRead(@Req() req, @Param("id", ParseIntPipe) id: number) {
    return this.notificationService.markAsRead(req.user.id, id);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a notification by ID" })
  @ResponseMessage("Delete notification")
  deleteNotification(@Req() req, @Param("id", ParseIntPipe) id: number) {
    return this.notificationService.deleteNotification(req.user.id, id);
  }
}
