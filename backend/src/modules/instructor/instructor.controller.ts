import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from "@nestjs/common";
import { InstructorService } from "./instructor.service";
import { ApplyInstructorDto } from "./dto/apply-instructor.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ResponseMessage, Roles } from "src/core/decorator/customize";

@ApiTags("Instructor")
@Controller("instructor")
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Post("instructor-application")
  @ApiOperation({ summary: "Apply to be an instructor" })
  @ResponseMessage("apply instructor")
  @ApiBearerAuth()
  applyInstructor(@Req() req, @Body() body: ApplyInstructorDto) {
    return this.instructorService.applyInstructor(req.user.id, body);
  }

  @Patch("approve-instructor")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Approve instructor" })
  @ResponseMessage("approve instructor")
  @ApiBearerAuth()
  approveInstructor(@Body() body: { applicationId: number; userId: number }) {
    return this.instructorService.approveInstructor(
      body.userId,
      body.applicationId
    );
  }

  @Patch("reject-instructor")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Reject instructor" })
  @ResponseMessage("reject instructor")
  @ApiBearerAuth()
  rejectInstructor(@Body() body: { applicationId: number; userId: number }) {
    return this.instructorService.rejectInstructor(
      body.userId,
      body.applicationId
    );
  }

  @Get("instructor-applications")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get all instructor applications" })
  @ResponseMessage("get all instructor applications pending")
  @ApiBearerAuth()
  getAllInstructorApplications() {
    return this.instructorService.getAllInstructorApplications();
  }

  @Get("instructor-application/:id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get instructor application by user ID" })
  @ResponseMessage("get instructor application by user ID")
  @ApiBearerAuth()
  getInstructorApplicationByUserId(@Param("id") userId: number) {
    return this.instructorService.getInstructorApplicationByUserId(userId);
  }
}
