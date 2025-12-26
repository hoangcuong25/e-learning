import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";
import { MailerService } from "@nestjs-modules/mailer";
import { v4 as uuidv4 } from "uuid";
import { console } from "inspector";
import axios from "axios";
import {
  comparePasswordHelper,
  hashPasswordHelper,
} from "src/core/helpers/util";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailerService: MailerService
    // @InjectRedis() private readonly redis: Redis
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValidPassword = await comparePasswordHelper(pass, user.password);

    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  createRefreshToken = (payload: any) => {
    const refreshExpire =
      this.configService.get<string>("JWT_REFRESH_EXPIRE") || "7d";
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRE"),
    });
    return refresh_token;
  };

  async login(user: any, response: Response) {
    const userLogin = await this.userService.findById(user.id);

    const payload = {
      sub: userLogin.email,
      iss: "from server",
      id: user.id,
      role: userLogin?.role,
    };

    const refresh_token = this.createRefreshToken(payload);
    await this.userService.storeRefreshToken(user.id, refresh_token);

    // Đặt cookie refresh_token
    response.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Trong dev thì false
      sameSite: "lax", // Hoặc "none" nếu cần cross-site + secure: true
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return {
      access_token: this.jwtService.sign(payload),
      role: userLogin?.role,
    };
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.userService.handleRegister(registerDto);
  };

  async logout(req) {
    try {
      const access_token = req.headers.authorization?.split(" ")[1];

      if (!access_token) {
        throw new UnauthorizedException("Không có access token");
      }

      const decoded = this.jwtService.verify(access_token, {
        secret: this.configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
      });

      this.userService.clearRefreshTokenInDatabase(decoded.id);

      return "Đăng xuất thành công";
    } catch {
      throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn");
    }
  }

  async refreshToken(req) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken)
      throw new UnauthorizedException(
        "Không tìm thấy mã làm mới (refresh token)"
      );

    const decoded = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
    });

    const storedToken = await this.userService.getRefreshTokenByUserId(
      decoded.id
    );

    console.log("Token lưu trong DB:", storedToken);
    console.log("Token gửi lên:", refreshToken);
    console.log("So sánh:", storedToken === refreshToken);

    if (storedToken.refreshToken !== refreshToken)
      throw new UnauthorizedException("Refresh token không hợp lệ");

    const user = await this.userService.findById(decoded.id);

    const payload = {
      sub: user.email,
      iss: "from server",
      id: user.id,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  async sendEmailActive(userId) {
    const codeId = Math.random().toString(36).substring(2, 8);

    const user = await this.userService.findById(userId);

    this.mailerService.sendMail({
      to: user?.email,
      subject: "Kích hoạt tài khoản", // tiêu đề
      text: "Chào mừng bạn", // nội dung ngắn gọn
      template: "register",
      context: {
        name: user?.fullname,
        activationCode: codeId,
      },
    });

    await this.userService.updateCodeActive(userId, codeId);

    return "Gửi email kích hoạt thành công";
  }

  async comfirmActive(userId, otp) {
    const user = await this.userService.findById(userId);

    if (user?.verificationOtp !== otp) {
      throw new BadRequestException("Mã kích hoạt không hợp lệ");
    }

    if (
      user?.verificationOtpExpires &&
      new Date() > user.verificationOtpExpires
    ) {
      throw new BadRequestException("Mã kích hoạt đã hết hạn");
    }

    await this.userService.activeAccount(userId);

    return "Kích hoạt tài khoản thành công";
  }

  async sendResetOtp(email) {
    if (!email) {
      throw new BadRequestException("Vui lòng nhập email");
    }

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException("Người dùng không tồn tại");
    }

    const otp = Math.random().toString(36).substring(2, 8);

    await this.userService.updateOptReset(user.id, otp);

    this.mailerService.sendMail({
      to: user?.email,
      subject: "Đặt lại mật khẩu",
      text: "Đặt lại mật khẩu của bạn",
      template: "resetPassword",
      context: {
        name: user?.fullname,
        activationCode: otp,
      },
    });

    return "Đã gửi mã OTP đặt lại mật khẩu";
  }

  async resetPassword(email, otp, newPassword) {
    if (!email || !otp || !newPassword) {
      throw new BadRequestException(
        "Vui lòng nhập đầy đủ Email, OTP và mật khẩu mới"
      );
    }

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException("Không tìm thấy người dùng");
    }

    if (user?.resetOtp === "" || user?.resetOtp !== otp) {
      throw new BadRequestException("OTP không hợp lệ");
    }

    if (user?.resetOtpExpires && new Date() > user.resetOtpExpires) {
      throw new BadRequestException("OTP đã hết hạn");
    }

    const hashPassword = await hashPasswordHelper(newPassword);

    this.userService.resetPassword(user.id, hashPassword);

    return "Đặt lại mật khẩu thành công";
  }

  async verifyGoogleToken(access_token: string) {
    const res = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res.data;
  }

  async loginGoogle(googleToken: string, response: Response) {
    if (!googleToken) {
      throw new BadRequestException("Thiếu mã xác thực Google");
    }

    const { email, name, picture, email_verified } =
      await this.verifyGoogleToken(googleToken);

    if (!email_verified) {
      throw new BadRequestException("Email Google chưa được xác minh");
    }

    const user = await this.userService.findByEmail(email);

    if (user) {
      const payload = {
        sub: user.email,
        iss: "from server",
        id: user.id,
        role: user.role,
      };

      const access_token = this.jwtService.sign(payload);
      const refresh_token = this.createRefreshToken(payload);

      await this.userService.storeRefreshToken(user.id, refresh_token);

      // Đặt cookie refresh_token
      response.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return {
        access_token,
        user,
      };
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await hashPasswordHelper(generatedPassword);

      const userData = {
        fullname: name,
        email,
        password: hashedPassword,
        dob: null,
        avatar: picture,
        isVerified: true,
      };

      const user = await this.userService.createWithGoogle(userData);

      const payload = {
        sub: user.email,
        iss: "from server",
        id: user.id,
        role: user.role,
      };

      const access_token = this.jwtService.sign(payload);
      const refresh_token = this.createRefreshToken(payload);

      await this.userService.storeRefreshToken(user.id, refresh_token);

      // Đặt cookie refresh_token
      response.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return {
        access_token,
        user,
      };
    }
  }
}
