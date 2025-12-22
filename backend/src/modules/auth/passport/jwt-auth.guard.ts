import { IS_PUBLIC_KEY } from "src/decorator/customize";
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException("Vui lòng đăng nhập trước.");
    }

    const requiredRoles = this.reflector.get<string[]>(
      "roles",
      context.getHandler()
    );

    // Nếu không có roles được yêu cầu, user hợp lệ được phép truy cập
    if (!requiredRoles || requiredRoles.length === 0) {
      return user;
    }

    // Chuyển `user.role` thành một mảng nếu nó là chuỗi
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];

    // Kiểm tra user có ít nhất một role được yêu cầu không
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        "You do not have permission to access this endpoint."
      );
    }

    return user;
  }
}
