import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  SubscribeMessage,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Notification } from "@prisma/client";
import { UseGuards } from "@nestjs/common";
import { WsJwtAuthGuard } from "../auth/passport/ws-jwt-auth.guard";

interface AuthenticatedSocket extends Socket {
  user: {
    id: number;
  };
}

@WebSocketGateway({
  namespace: "notifications",
  cors: { origin: "*" },
  guards: [WsJwtAuthGuard],
})
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  /**
   * Phương thức được gọi sau khi client kết nối thành công và đã được xác thực
   */
  handleConnection(client: AuthenticatedSocket) {
    // Tự động cho client tham gia phòng (Rooms) ngay sau khi kết nối
    // Không cần client phải gửi sự kiện 'subscribe' thủ công nữa
    const userId = client.user.id.toString(); // Lấy ID đã được gắn từ Guard

    if (userId) {
      client.join(userId);
      console.log(`Client ${client.id} connected & joined room: ${userId}`);
    } else {
      // Trường hợp hiếm gặp nếu Guard có lỗi
      client.disconnect(true);
      console.log(`Client ${client.id} failed to retrieve userId.`);
    }
  }

  /**
   * Hàm này được gọi bởi NotificationService để đẩy thông báo
   * @param userId - ID của người dùng (tên phòng)
   * @param payload - Thông báo đầy đủ từ Prisma
   */
  sendNotificationToUser(userId: string, payload: Notification) {
    // Tối ưu: Đảm bảo userId là string vì Socket.IO room names là string
    const roomName = userId.toString();
    this.server.to(roomName).emit("newNotification", payload);
  }
}
