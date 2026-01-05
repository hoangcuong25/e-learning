import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  SubscribeMessage,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Notification } from "@prisma/client";
import { UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SocketAuthMiddleware } from "../auth/middleware/ws-auth.middleware";

interface AuthenticatedSocket extends Socket {
  user: {
    email: string;
  };
}

@WebSocketGateway({
  namespace: "notifications",
  cors: { origin: "*", credentials: true },
})
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Áp dụng Middleware xác thực Socket.IO
   */
  afterInit(server: Server) {
    server.use(SocketAuthMiddleware(this.jwtService));
  }

  /**
   * Phương thức được gọi sau khi client kết nối thành công và đã được xác thực
   */
  handleConnection(client: AuthenticatedSocket) {
    // Middleware đã kiểm tra Auth. Phần này chỉ cần kiểm tra user được gắn
    if (!client.user || !client.user.email) {
      // Trường hợp này chỉ xảy ra nếu Middleware gặp lỗi không ném exception
      client.disconnect(true);
      return;
    }

    const email = client.user.email.toString(); // Lấy email đã được gắn từ Middleware

    client.join(`notification-${email}`);
  }

  /**
   * Hàm này được gọi bởi NotificationService để đẩy thông báo
   */
  sendNotificationToUser(email: string, payload: Notification) {
    this.server.to(`notification-${email}`).emit("newNotification", payload);
  }
}
