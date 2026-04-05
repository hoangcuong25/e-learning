import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateAuthDto } from "../auth/dto/create-auth.dto";
import { MailerService } from "@nestjs-modules/mailer";
import * as dayjs from "dayjs";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CloudinaryService } from "src/core/cloudinary/cloudinary.service";
import {
  comparePasswordHelper,
  hashPasswordHelper,
} from "src/core/helpers/util";
import {
  buildPaginationParams,
  buildOrderBy,
  buildSearchFilter,
  buildPaginationResponse,
} from "src/core/helpers/pagination.util";
import { UserPaginationQueryDto } from "./dto/user-pagination.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
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

  async findAll(paginationDto: UserPaginationQueryDto) {
    const { skip, take, page, limit } = buildPaginationParams(paginationDto);
    const orderBy = buildOrderBy(paginationDto);
    const searchFilter = buildSearchFilter(paginationDto, [
      "fullname",
      "email",
    ]);

    const where: any = {
      ...(searchFilter || {}),
    };

    if (paginationDto.role) {
      where.role = paginationDto.role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          fullname: true,
          email: true,
          avatar: true,
          gender: true,
          dob: true,
          address: true,
          phone: true,
          isVerified: true,
          walletBalance: true,
          createdAt: true,
          updatedAt: true,
          role: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return buildPaginationResponse(users, total, page, limit);
  }

  async getProfile(userId: number) {
    if (!userId) {
      throw new BadRequestException("Cần cung cấp ID người dùng");
    }

    const [user, cartCount, enrollmentCount, completedCount] =
      await this.prisma.$transaction([
        this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            fullname: true,
            email: true,
            avatar: true,
            gender: true,
            dob: true,
            address: true,
            phone: true,
            role: true,
            isVerified: true,
            walletBalance: true,
            createdAt: true,
            updatedAt: true,
          },
        }),

        this.prisma.cartItem.count({
          where: { cart: { userId } },
        }),

        this.prisma.enrollment.count({
          where: { userId },
        }),

        this.prisma.enrollment.count({
          where: {
            userId,
            OR: [{ completedAt: { not: null } }, { progress: 100 }],
          },
        }),
      ]);

    if (!user) {
      throw new NotFoundException("Không tìm thấy người dùng");
    }

    return {
      ...user,
      cartCount,
      enrollmentCount,
      completedCount,
    };
  }

  async getActivity(userId: number) {
    if (!userId) {
      throw new BadRequestException("Cần cung cấp ID người dùng");
    }

    const [lessonProgresses, userMissions] = await Promise.all([
      this.prisma.lessonProgress.findMany({
        where: { userId, isCompleted: true, completedAt: { not: null } },
        select: { completedAt: true },
      }),
      this.prisma.userMission.findMany({
        where: { userId, OR: [{ isCompleted: true }, { progress: { gt: 0 } }] },
        select: { date: true, updatedAt: true },
      }),
    ]);

    const activityObj: Record<string, number> = {};

    lessonProgresses.forEach((lp) => {
      if (lp.completedAt) {
        const dateStr = dayjs(lp.completedAt).format("YYYY-MM-DD");
        activityObj[dateStr] = (activityObj[dateStr] || 0) + 1;
      }
    });

    userMissions.forEach((um) => {
      const dateStr = dayjs(um.date || um.updatedAt).format("YYYY-MM-DD");
      activityObj[dateStr] = (activityObj[dateStr] || 0) + 1;
    });

    let streak = 0;
    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    let currentDate = dayjs();

    if (activityObj[today]) {
      // Valid, streak count from today
    } else if (activityObj[yesterday]) {
      // Valid, streak count from yesterday
      currentDate = currentDate.subtract(1, "day");
    } else {
      // No streak
      return {
        streak: 0,
        activityMap: Object.keys(activityObj).map((date) => ({
          date,
          count: activityObj[date],
        })),
      };
    }

    while (true) {
      const dateStr = currentDate.format("YYYY-MM-DD");
      if (activityObj[dateStr]) {
        streak++;
        currentDate = currentDate.subtract(1, "day");
      } else {
        break;
      }
    }

    return {
      streak,
      activityMap: Object.keys(activityObj).map((date) => ({
        date,
        count: activityObj[date],
      })),
    };
  }

  async updateProfile(
    userId: number,
    updateUserDto: any,
    avatar?: Express.Multer.File,
  ) {
    // 1. Kiểm tra người dùng tồn tại
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException("Không tìm thấy người dùng");

    // 2. Chuẩn bị dữ liệu để cập nhật
    const updateData: any = { ...updateUserDto };

    if (avatar) {
      // Xóa avatar cũ trên Cloudinary (nếu có)
      if (user.avatar) {
        try {
          // Extract public_id từ URL Cloudinary
          const urlParts = user.avatar.split("/");
          const fileNameWithExt = urlParts[urlParts.length - 1];
          const fileName = fileNameWithExt.split(".")[0];
          const folder = urlParts[urlParts.length - 2];
          const publicId = `${folder}/${fileName}`;

          await this.cloudinaryService.deleteFile(publicId, "image");
        } catch (error) {
          console.error("Error deleting old avatar:", error);
        }
      }

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
      user.password,
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

  async getWall(targetUserId: number, currentUserId?: number) {
    if (!targetUserId) {
      throw new BadRequestException("Cần cung cấp ID người dùng");
    }

    const [user, isFollowing] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: targetUserId },
        select: {
          id: true,
          fullname: true,
          email: true,
          avatar: true,
          gender: true,
          dob: true,
          address: true,
          phone: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              followers: true,
              following: true,
            },
          },
        },
      }),
      currentUserId
        ? this.prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: currentUserId,
                followingId: targetUserId,
              },
            },
          })
        : null,
    ]);

    if (!user) {
      throw new NotFoundException("Không tìm thấy người dùng");
    }

    return {
      ...user,
      isFollowing: !!isFollowing,
    };
  }
  async getUserDetailForAdmin(userId: number) {
    if (!userId) {
      throw new BadRequestException("Cần cung cấp ID người dùng");
    }

    const [user, enrollments] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          fullname: true,
          email: true,
          avatar: true,
          gender: true,
          dob: true,
          address: true,
          phone: true,
          role: true,
          isVerified: true,
          walletBalance: true,
          createdAt: true,
          updatedAt: true,
        },
      }),

      this.prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              price: true,
              type: true,
              instructor: {
                select: { id: true, fullname: true, avatar: true },
              },
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
      }),
    ]);

    if (!user) {
      throw new NotFoundException("Không tìm thấy người dùng");
    }

    // Tính toán thêm một số stats nhanh
    const totalSpent = enrollments.reduce((acc, curr) => {
      // Giả sử amount trong transaction hoặc lấy từ course price (tạm thời)
      // Trong thực tế nên join với Transaction để chính xác hơn
      return acc + (curr.course.type === "PAID" ? curr.course.price : 0);
    }, 0);

    const completedCount = enrollments.filter(
      (e) => e.progress === 100 || e.completedAt !== null,
    ).length;

    return {
      ...user,
      enrollments,
      stats: {
        totalCourses: enrollments.length,
        completedCourses: completedCount,
        totalSpent,
      },
    };
  }
}
