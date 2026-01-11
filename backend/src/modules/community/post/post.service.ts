import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostQueryDto } from "./dto/post-query.dto";
import { PostVisibility } from "@prisma/client";
import {
  buildPaginationParams,
  buildOrderBy,
  buildPaginationResponse,
  buildSearchFilter,
} from "src/core/helpers/pagination.util";

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const { media, ...postData } = createPostDto;

    return this.prisma.post.create({
      data: {
        ...postData,
        authorId: userId,
        media: {
          create: media,
        },
      },
      include: {
        media: true,
        author: {
          select: {
            id: true,
            fullname: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findAll(currentUserId: number | null, query: PostQueryDto) {
    const { authorId, visibility } = query;
    const { skip, take, page, limit } = buildPaginationParams(query);
    const orderBy = buildOrderBy(query);

    const where: any = {};

    const searchFilter = buildSearchFilter(query, ["content"]);
    if (searchFilter) Object.assign(where, searchFilter);

    if (authorId) where.authorId = authorId;
    if (visibility) where.visibility = visibility;

    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          media: true,
          author: {
            select: {
              id: true,
              fullname: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
              shares: true,
            },
          },
          ...(currentUserId && {
            likes: {
              where: {
                userId: currentUserId,
              },
              select: {
                id: true,
              },
            },
          }),
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    const result = items.map((post) => ({
      ...post,
      isLiked: currentUserId ? post.likes?.length > 0 || false : false,
      likes: undefined, // không trả raw like
    }));

    return buildPaginationResponse(result, total, page, limit);
  }

  async findOne(id: number, userId: number | null) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        media: true,
        author: {
          select: {
            id: true,
            fullname: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            shares: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Bài viết có id: ${id} không tồn tại`);
    }

    // Nếu bài viết PRIVATE và user chưa đăng nhập hoặc không phải author
    if (
      post.visibility === "PRIVATE" &&
      (!userId || post.authorId !== userId)
    ) {
      throw new ForbiddenException("Bạn chỉ có thể truy cập bài viết của mình");
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (post.authorId !== userId) {
      throw new ForbiddenException("Bạn chỉ có thể cập nhật bài viết của mình");
    }

    const { media, ...data } = updatePostDto;

    if (media) {
      await this.prisma.postMedia.deleteMany({ where: { postId: id } });
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        ...data,
        media: media
          ? {
              create: media,
            }
          : undefined,
      },
      include: {
        media: true,
      },
    });
  }

  async remove(id: number, userId: number, userRole: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (post.authorId !== userId && userRole !== "ADMIN") {
      throw new ForbiddenException("You can only delete your own posts");
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }

  async toggleLike(postId: number, userId: number) {
    const existingLike = await this.prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.postLike.delete({
        where: { id: existingLike.id },
      });
      return { message: "Unliked" };
    } else {
      await this.prisma.postLike.create({
        data: {
          userId,
          postId,
        },
      });
      return { message: "Liked" };
    }
  }

  async share(postId: number, userId: number, content?: string) {
    return this.prisma.postShare.create({
      data: {
        postId,
        userId,
        content,
      },
    });
  }
}
