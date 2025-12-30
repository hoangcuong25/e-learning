import { Controller, Post, Delete, Get, Param, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles, ResponseMessage } from "src/core/decorator/customize";
import { CartService } from "./cart.service";

@ApiTags("Cart")
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user cart with items" })
  @ResponseMessage("Get user cart")
  async getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post("add/:courseId")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add course to user cart" })
  @ResponseMessage("Course added to cart")
  async addCourseToCart(@Param("courseId") courseId: string, @Req() req) {
    return this.cartService.addCourseToCart(req.user.id, +courseId);
  }

  @Delete("remove/:courseId")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Remove course from user cart" })
  @ResponseMessage("Course removed from cart")
  async removeCourseFromCart(@Param("courseId") courseId: string, @Req() req) {
    return this.cartService.removeCourseFromCart(req.user.id, +courseId);
  }

  @Delete("clear")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Clear all courses in cart" })
  @ResponseMessage("Cart cleared")
  async clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
