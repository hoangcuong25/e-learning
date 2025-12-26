import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateAuthDto } from "../auth/dto/create-auth.dto";
import { MailerService } from "@nestjs-modules/mailer";
import dayjs from "dayjs";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CloudinaryService } from "src/core/cloudinary/cloudinary.service";
import {
  comparePasswordHelper,
  hashPasswordHelper,
} from "src/core/helpers/util";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async clearRefreshTokenInDatabase(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
        refreshTokenExpires: null,
      },
    });
  }

  async isEmailExist(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return !!user;
  }

  async updateCodeActive(id: number, codeId: string) {
    await this.prisma.user.update({
      where: { id },
      data: {
        verificationOtp: codeId,
        verificationOtpExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 phút
      },
    });
  }

  async activeAccount(id: number) {
    await this.prisma.user.update({
      where: { id },
      data: {
        isVerified: true,
        verificationOtp: null,
        verificationOtpExpires: null,
      },
    });
  }

  async updateOptReset(id: number, otp: string) {
    await this.prisma.user.update({
      where: { id },
      data: {
        resetOtp: otp,
        resetOtpExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 phút
      },
    });
  }

  async resetPassword(id: number, password: string) {
    await this.prisma.user.update({
      where: { id },
      data: {
        password,
        resetOtp: null,
        resetOtpExpires: null,
      },
    });
  }

  async createWithGoogle(userData: any) {
    const newUser = await this.prisma.user.create({
      data: userData,
    });
    return newUser;
  }

  async getRefreshTokenByUserId(userId: number) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: { refreshToken: true },
    });
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { fullname, email, password1, password2 } = createUserDto;

      if (await this.isEmailExist(email))
        throw new BadRequestException("Email đã tồn tại");
      if (password1 !== password2)
        throw new BadRequestException("Mật khẩu không khớp");

      const hashPassword = await hashPasswordHelper(password1);

      const savedUser = await this.prisma.user.create({
        data: {
          fullname,
          email,
          password: hashPassword,
          isVerified: false,
          // codeExpired: dayjs().add(5, 'minute').toDate(),
        },
      });

      return { id: savedUser.id };
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Lỗi máy chủ nội bộ");
    }
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    if (!id) {
      throw new BadRequestException("Cần cung cấp ID người dùng");
    }

    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { fullname, email, password1, password2 } = registerDto;

    if (await this.isEmailExist(email))
      throw new BadRequestException("Email đã tồn tại!");
    if (password1 !== password2)
      throw new BadRequestException("Mật khẩu không khớp");

    const hashPassword = await hashPasswordHelper(password1);

    const savedUser = await this.prisma.user.create({
      data: {
        fullname,
        email,
        password: hashPassword,
        isVerified: false,
      },
    });
    return { id: savedUser.id };
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async getProfile(userId: number) {
    return await this.findById(userId);
  }

  async updateProfile(
    userId: number,
    updateUserDto: any,
    avatar?: Express.Multer.File
  ) {
    // 1. Kiểm tra người dùng tồn tại
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException("Không tìm thấy người dùng");

    // 2. Chuẩn bị dữ liệu để cập nhật
    const updateData: any = { ...updateUserDto };

    if (avatar) {
      const uploaded = await this.cloudinaryService.uploadFile(avatar);
      updateData.avatar = uploaded.url;
    }

    // Nếu có ngày sinh (dob), chuyển sang dạng Date
    updateData.dob = new Date(updateData.dob);

    // 3. Cập nhật thông tin người dùng với Prisma
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async updatePassword(userId: number, body: any) {
    const { newPassword1, newPassword2, oldPassword } = body;
    const user = await this.findById(userId);
    if (!user) throw new BadRequestException("Không tìm thấy người dùng");

    const isOldPasswordValid = await comparePasswordHelper(
      oldPassword,
      user.password
    );
    if (!isOldPasswordValid)
      throw new BadRequestException("Mật khẩu cũ không chính xác");
    if (newPassword1 !== newPassword2)
      throw new BadRequestException("Hai mật khẩu mới không khớp");

    const hashedPassword = await hashPasswordHelper(newPassword1);
    return await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async deleteUser(userId: number) {
    return await this.prisma.user.delete({ where: { id: userId } });
  }

  async storeRefreshToken(userId: number, refreshToken: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken,
        refreshTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
      },
    });
  }
}
