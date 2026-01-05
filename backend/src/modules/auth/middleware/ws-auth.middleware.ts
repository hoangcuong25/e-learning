import { Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { WsException } from "@nestjs/websockets";
import { TokenExpiredError } from "jsonwebtoken";

export type SocketIoMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
) => void;

/**
 * Middleware để xác thực token JWT từ query parameter trong handshake
 * và gắn thông tin user vào socket.
 */
export const SocketAuthMiddleware = (
  jwtService: JwtService
): SocketIoMiddleware => {
  return (socket, next) => {
    const token = socket.handshake.query.token as string;

    if (!token) {
      return next(new WsException("Unauthorized - Token not provided"));
    }

    try {
      // Xác thực token
      const payload = jwtService.verify(token);

      // Gắn thông tin người dùng vào socket
      (socket as any).user = {
        email: payload.sub,
      };

      next(); // Cho phép kết nối tiếp tục
    } catch (error) {
      // Kiểm tra lỗi Token hết hạn
      if (error instanceof TokenExpiredError) {
        // Trả về WsException với một thông báo lỗi cụ thể
        return next(new WsException("TokenExpired"));
      }

      // Các lỗi xác thực khác (token không hợp lệ, sai chữ ký,...)
      return next(new WsException("Unauthorized - Invalid token"));
    }
  };
};
