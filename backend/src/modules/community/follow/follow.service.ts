import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../../core/prisma/prisma.service";
import {
  buildPaginationParams,
  buildPaginationResponse,
} from "../../../core/helpers/pagination.util";
import { PaginationQueryDto } from "../../../core/dto/pagination-query.dto";

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  async follow(followerId: number, followingId: number) {
    if (followerId === followingId) {
      throw new BadRequestException("Bạn không thể theo dõi chính mình");
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!targetUser) {
      throw new NotFoundException("Người dùng không tồn tại");
    }

    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      throw new BadRequestException("Bạn đã theo dõi người dùng này rồi");
    }

    return await this.prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
  }

  async unfollow(followerId: number, followingId: number) {
    if (followerId === followingId) {
      throw new BadRequestException("Bạn không thể hủy theo dõi chính mình");
    }

    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!follow) {
      throw new NotFoundException("Bạn chưa theo dõi người dùng này");
    }

    return await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }

  async getFollowers(userId: number, query: PaginationQueryDto) {
    const { skip, take, page, limit } = buildPaginationParams(query);

    const [followers, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followingId: userId },
        skip,
        take,
        include: {
          follower: {
            select: {
              id: true,
              fullname: true,
              avatar: true,
              role: true,
              email: true,
              followers: {
                where: {
                  followerId: userId,
                },
                select: { id: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.follow.count({ where: { followingId: userId } }),
    ]);

    const data = followers.map((f) => ({
      ...f.follower,
      isFollowing: f.follower.followers.length > 0,
    }));

    return buildPaginationResponse(data, total, page, limit);
  }

  async getFollowing(userId: number, query: PaginationQueryDto) {
    const { skip, take, page, limit } = buildPaginationParams(query);

    const [following, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followerId: userId },
        skip,
        take,
        include: {
          following: {
            select: {
              id: true,
              fullname: true,
              avatar: true,
              role: true,
              email: true,
              followers: {
                where: {
                  followerId: userId,
                },
                select: { id: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.follow.count({ where: { followerId: userId } }),
    ]);

    const data = following.map((f) => ({
      ...f.following,
      isFollowing: f.following.followers.length > 0,
    }));

    return buildPaginationResponse(data, total, page, limit);
  }

  async isFollowing(followerId: number, followingId: number) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return { isFollowing: !!follow };
  }

  async getSuggestions(userId: number | undefined, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Guest → user nổi bật
    if (!userId) {
      return this.getPopularUsers(skip, limit);
    }

    // Lấy danh sách đang follow
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    // Mutual follow
    const mutualUsers = await this.prisma.follow.findMany({
      where: {
        followerId: { in: followingIds },
        followingId: {
          notIn: [...followingIds, userId],
        },
      },
      select: {
        following: {
          select: {
            id: true,
            fullname: true,
            avatar: true,
            role: true,
          },
        },
      },
      distinct: ["followingId"],
      take: limit,
    });

    // Nếu đủ rồi → return luôn
    if (mutualUsers.length >= limit) {
      return mutualUsers.map((m) => m.following);
    }

    // Gợi ý user nổi bật (fallback)
    const mutualUsersIds = mutualUsers.map((m) => m.following.id);
    const popularUsers = await this.prisma.user.findMany({
      where: {
        id: {
          notIn: [...followingIds, userId, ...mutualUsersIds],
        },
      },
      select: {
        id: true,
        fullname: true,
        avatar: true,
        role: true,
        _count: {
          select: { followers: true },
        },
      },
      orderBy: {
        followers: { _count: "desc" },
      },
      skip,
      take: limit - mutualUsers.length,
    });

    return [...mutualUsers.map((m) => m.following), ...popularUsers];
  }

  private async getPopularUsers(skip: number, limit: number) {
    return this.prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        avatar: true,
        role: true,
        _count: {
          select: { followers: true },
        },
      },
      orderBy: {
        followers: { _count: "desc" },
      },
      skip,
      take: limit,
    });
  }
}
