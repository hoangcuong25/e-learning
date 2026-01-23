import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from "@nestjs/common";
import { CouponService } from "./coupon.service";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles, Public, ResponseMessage } from "src/core/decorator/customize";
import { PaginationQueryDto } from "src/core/dto/pagination-query.dto";

@ApiTags("Coupon")
@Controller("coupon")
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @Roles("INSTRUCTOR")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create new coupon" })
  @ResponseMessage("Create coupon successfully")
  create(@Body() dto: CreateCouponDto, @Req() req) {
    return this.couponService.create(dto, req.user.id);
  }

  @Post("admin")
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Admin tạo coupon (bắt buộc link với DiscountCampaign)",
  })
  @ResponseMessage("Admin create coupon successfully")
  createCouponDiscountByAdmin(@Body() dto: CreateCouponDto, @Req() req) {
    return this.couponService.createCouponDiscountByAdmin(dto, req.user.id);
  }

  @Get()
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all coupons with pagination" })
  @ResponseMessage("Get all coupons")
  findAll(@Query() query: PaginationQueryDto) {
    return this.couponService.findAll(query);
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get coupon detail by ID" })
  @ResponseMessage("Get coupon detail")
  findOne(@Param("id") id: string) {
    return this.couponService.findOne(+id);
  }

  @Patch(":id")
  @Roles("INSTRUCTOR")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update coupon information" })
  @ResponseMessage("Update coupon successfully")
  update(@Param("id") id: string, @Body() dto: UpdateCouponDto, @Req() req) {
    return this.couponService.update(+id, dto, req.user.id);
  }

  @Delete(":id")
  @Roles("INSTRUCTOR")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete coupon by ID" })
  @ResponseMessage("Delete coupon successfully")
  remove(@Param("id") id: string, @Req() req) {
    return this.couponService.remove(+id, req.user.id);
  }

  @Post(":code/apply")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Apply coupon to course" })
  @ResponseMessage("Apply coupon successfully")
  applyCoupon(
    @Param("code") code: string,
    @Body("courseId") courseId: number,
    @Req() req
  ) {
    return this.couponService.applyCoupon(req.user.id, code, +courseId);
  }

  @Get("instructor/me")
  @Roles("INSTRUCTOR")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all coupons by instructor" })
  @ResponseMessage("Get instructor coupons successfully")
  getMyCoupons(@Req() req) {
    return this.couponService.getCouponsByInstructor(req.user.id);
  }
}
