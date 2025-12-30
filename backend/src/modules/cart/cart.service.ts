import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Get or create cart
  private async getOrCreateCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { course: true } } },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: { include: { course: true } } },
      });
    }
    return cart;
  }

  // Get cart
  async getCart(userId: number) {
    return this.getOrCreateCart(userId);
  }

  // Add course to cart
  async addCourseToCart(userId: number, courseId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException("Course not found");

    const cart = await this.getOrCreateCart(userId);

    await this.prisma.cartItem.upsert({
      where: {
        cartId_courseId: { cartId: cart.id, courseId },
      },
      update: {},
      create: { cartId: cart.id, courseId },
    });

    return this.getOrCreateCart(userId);
  }

  // Remove course from cart
  async removeCourseFromCart(userId: number, courseId: number) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException("Cart not found");

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id, courseId },
    });

    return this.getOrCreateCart(userId);
  }

  // Clear all items
  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException("Cart not found");

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.getOrCreateCart(userId);
  }
}
