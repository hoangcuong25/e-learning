import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";

@Injectable()
export class WsJwtAuthGuard extends AuthGuard("jwt") implements CanActivate {
  // Phương thức này được NestJS gọi để kiểm tra quyền truy cập
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    // 1. Lấy đối tượng Socket từ ExecutionContext
    const client = context.switchToWs().getClient<Socket>();

    // 2. Lấy token từ thuộc tính 'auth' (mà Frontend gửi)
    const token = client.handshake.auth.token;

    if (!token) {
      // Ném ra WsException để gửi lỗi về client
      throw new WsException("Unauthorized: Missing access token");
    }

    // 3. Thực hiện xác thực JWT bằng strategy 'jwt' (cần phải định nghĩa)
    // AuthGuard('jwt') sẽ tự động xử lý việc này
    return super.canActivate(context) as boolean | Promise<boolean>;
  }

  // Phương thức này được gọi khi xác thực thành công (từ JwtStrategy)
  // Nó gắn thông tin user đã giải mã vào client socket
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      // Nếu có lỗi xác thực, ném WsException để ngắt kết nối
      throw err || new WsException("Unauthorized: Invalid token");
    }

    // 4. Gắn đối tượng user đã giải mã từ token vào đối tượng client socket
    // Đây là bước quan trọng nhất!
    const client = context.switchToWs().getClient<Socket>();
    (client as any).user = user;

    return user;
  }
}
