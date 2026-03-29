import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { CommentQueryDto } from "./dto/comment-query.dto";
import {
  buildPaginationParams,
  buildOrderBy,
  buildPaginationResponse,
} from "src/core/helpers/pagination.util";

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createCommentDto: CreateCommentDto) {
    const { postId, parentId, content } = createCommentDto;

    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException("Không tìm thấy bài viết");
    }

    if (parentId) {
      const parent = await this.prisma.postComment.findUnique({
        where: { id: parentId },
      });
      if (!parent) throw new NotFoundException("Không tìm thấy bình luận cha");
      if (parent.postId !== postId)
        throw new ForbiddenException("Bình luận phải thuộc bài viết cùng");
    }

    return this.prisma.postComment.create({
      data: {
        content,
        postId,
        parentId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findAllByPost(postId: number, query: CommentQueryDto) {
    const { skip, take, page, limit } = buildPaginationParams(query);
    const orderBy = buildOrderBy(query);

    // Fetch top-level comments (parentId is null)
    const where = { postId, parentId: null };

    const [items, total] = await Promise.all([
      this.prisma.postComment.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
          replies: {
            include: {
              replies: {
                include: {
                  user: true,
                },
              },
              user: true,
            },
          },
        },
      }),
      this.prisma.postComment.count({ where }),
    ]);

    return buildPaginationResponse(items, total, page, limit);
  }

  async findReplies(commentId: number) {
    return this.prisma.postComment.findMany({
      where: { parentId: commentId },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            avatar: true,
          },
        },
      },
    });
  }

  async update(id: number, userId: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.postComment.findUnique({ where: { id } });

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException("You can only update your own comment");
    }

    return this.prisma.postComment.update({
      where: { id },
      data: { content: updateCommentDto.content },
    });
  }

  async remove(id: number, userId: number) {
    const comment = await this.prisma.postComment.findUnique({ where: { id } });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!comment) throw new NotFoundException("Comment not found");

    if (comment.userId !== userId && user.role !== "ADMIN") {
      const post = await this.prisma.post.findUnique({
        where: { id: comment.postId },
      });
      if (post && post.authorId === userId) {
        return this.prisma.postComment.delete({ where: { id } });
      } else {
        throw new ForbiddenException("You can only delete your own comment");
      }
    }

    return this.prisma.postComment.delete({ where: { id } });
  }
}
