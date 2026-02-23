import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Query,
} from "@nestjs/common";
import { EnrollmentService } from "./enrollment.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles, Public, ResponseMessage } from "src/core/decorator/customize";

@ApiTags("Enrollment")
@Controller("enrollment")
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  // ─── USER ENROLL COURSE ──────────────────────────────
  @Post(":courseId")
  @ApiOperation({ summary: "Enroll a course (with optional coupon)" })
  @ApiBearerAuth()
  @ResponseMessage("Enroll course")
  async enrollCourse(
    @Param("courseId") courseId: string,
    @Body("couponCode") couponCode: string,
    @Req() req
  ) {
    return this.enrollmentService.enrollCourse(
      +courseId,
      req.user.id,
      couponCode
    );
  }

  // ─── USER GET MY ENROLLMENTS ──────────────────────────────
  @Get("me")
  @ApiOperation({ summary: "Get all my enrolled courses" })
  @ApiBearerAuth()
  @ResponseMessage("Get my enrollments")
  async getMyEnrollments(@Req() req) {
    return this.enrollmentService.getMyEnrollments(req.user.id);
  }

  // ─── GET ENROLLMENT DETAIL ──────────────────────────────
  @Get(":id")
  @ApiOperation({ summary: "Get enrollment detail" })
  @ApiBearerAuth()
  @ResponseMessage("Get enrollment detail")
  async getEnrollmentDetail(@Param("id") id: string, @Req() req) {
    return this.enrollmentService.getEnrollmentDetail(+id, req.user.id);
  }

  // ─── INSTRUCTOR: GET STUDENTS IN COURSE ──────────────────────────────
  @Get("instructor/:courseId/students")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Get all students in a specific course" })
  @ApiBearerAuth()
  @ResponseMessage("Get enrolled students")
  async getStudentsInCourse(@Param("courseId") courseId: string, @Req() req) {
    return this.enrollmentService.getStudentsInCourse(+courseId, req.user.id);
  }

  // ─── CANCEL ENROLLMENT ──────────────────────────────
  @Delete(":id")
  @ApiOperation({ summary: "Cancel enrollment" })
  @ApiBearerAuth()
  @ResponseMessage("Cancel enrollment")
  async cancelEnrollment(@Param("id") id: string, @Req() req) {
    return this.enrollmentService.cancelEnrollment(+id, req.user.id);
  }

  // ─── REFUND ENROLLMENT ──────────────────────────────
  @Post(":id/refund")
  @ApiOperation({
    summary: "Refund enrollment (within 1 hour, progress < 20%)",
  })
  @ApiBearerAuth()
  @ResponseMessage("Refund enrollment")
  async refundEnrollment(@Param("id") id: string, @Req() req) {
    return this.enrollmentService.refundEnrollment(+id, req.user.id);
  }

  // ─── USER GET COURSE PROGRESS ──────────────────────────────
  @Get(":courseId/progress")
  @ApiOperation({
    summary:
      "Get the current progress (percentage) of a specific course for the authenticated user",
  })
  @ApiBearerAuth()
  @ResponseMessage("Fetched course progress")
  async getCourseProgress(@Param("courseId") courseId: string, @Req() req) {
    return this.enrollmentService.getCourseProgress(+courseId, req.user.id);
  }
}
