import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err, user, info, context: ExecutionContext) {
    // Nếu info có giá trị, kiểm tra xem có phải là lỗi "No auth token" không
    // "No auth token" nghĩa là user không gửi token => coi là Guest => return null
    // Các lỗi khác (expired, invalid signature...) => throw 401
    if (info) {
      if (info.message === "No auth token") {
        return null;
      }
      throw new UnauthorizedException(info?.message || "Invalid token");
    }

    // Nếu không có lỗi, không có user (không gửi token), trả về null (Guest)
    if (err || !user) {
      return null;
    }

    return user;
  }
}
