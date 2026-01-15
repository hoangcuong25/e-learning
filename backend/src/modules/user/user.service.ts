import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateAuthDto } from "../auth/dto/create-auth.dto";
import { comparePasswordHelper, hashPasswordHelper } from "src/helpers/util";
import { MailerService } from "@nestjs-modules/mailer";
import dayjs from "dayjs";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  async clearRefreshTokenInDatabase(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
        refreshTokenExpires: null
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
        verificationOtpExpires: new Date(Date.now() + 5 * 60 * 1000),
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
        resetOtpExpires: new Date(Date.now() + 5 * 60 * 1000),
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

  // async createWithGoogle(userData: Partial<User>) {
  //   const newUser = this.prisma.user.create({
  //     data: userData,
  //   });
  //   return await newUser;
  // }

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
        throw new BadRequestException("Email already exists");
      if (password1 !== password2)
        throw new BadRequestException("Password not match");

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
      throw new BadRequestException("Internal server error");
    }
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { fullname, email, password1, password2 } = registerDto;

    if (await this.isEmailExist(email))
      throw new BadRequestException("Email already exists!");
    if (password1 !== password2)
      throw new BadRequestException("Password not match");

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

  // async updateProfile(req: { _id: number }, updateUserDto: any, image?: Express.Multer.File) {
  //   const user = await this.findById(req._id);
  //   if (!user) throw new BadRequestException('User not found');

  //   const updateData = { ...updateUserDto };

  //   if (image) {
  //     const imageUpload = await this.cloudinaryService.uploadFile(image);
  //     updateData['image'] = imageUpload.url;
  //   }

  //   await this.userRepository.update(req._id, updateData);
  //   return 'ok';
  // }

  // async updatePhone(req: { _id: string }, phone: string) {
  //   await this.userRepository.update(req._id, { phone });
  //   return 'ok';
  // }

  // async updatePassword(req: { _id: number }, reqBody: any) {
  //   const { newPassword1, newPassword2, oldPassword } = reqBody;
  //   const user = await this.findById(req._id);
  //   if (!user) throw new BadRequestException('User not found');

  //   const isOldPasswordValid = await comparePasswordHelper(oldPassword, user.password);
  //   if (!isOldPasswordValid) throw new BadRequestException('Incorrect old password');
  //   if (newPassword1 !== newPassword2) throw new BadRequestException('New passwords do not match');

  //   const hashedPassword = await hashPasswordHelper(newPassword1);
  //   await this.userRepository.update(req._id, { password: hashedPassword });

  //   return 'ok';
  // }

  // async deleteUser(userId: string) {
  //   await this.userRepository.delete(userId);
  //   return 'ok';
  // }

  async storeRefreshToken(userId: number, refreshToken: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken,
        refreshTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
  }
}
