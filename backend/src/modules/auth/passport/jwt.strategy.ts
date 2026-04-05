import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>("JWT_ACCESS_TOKEN_SECRET") ||
        "defaultSecretKey",
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.id);

    if (!user || user.isBlocked) {
      throw new UnauthorizedException(
        "Tài khoản của bạn đã bị khóa hoặc không tồn tại.",
      );
    }

    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
