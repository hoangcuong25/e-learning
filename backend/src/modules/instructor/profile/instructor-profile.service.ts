import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class InstructorProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: number) {
    const profile = await this.prisma.instructorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException("Instructor profile not found");
    }

    return profile;
  }

  async updateProfile(
    userId: number,
    data: { bio?: string; experience?: string }
  ) {
    const profile = await this.prisma.instructorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException("Instructor profile not found");
    }

    return await this.prisma.instructorProfile.update({
      where: { userId },
      data,
    });
  }

  async getProfileByInstructorId(id: number) {
    const profile = await this.prisma.instructorProfile.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
    if (!profile) {
      throw new NotFoundException("Instructor profile not found");
    }
    return profile;
  }
}
