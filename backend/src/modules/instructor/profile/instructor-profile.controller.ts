import { Controller, Get, Body, Patch, Req, Param } from "@nestjs/common";
import { InstructorProfileService } from "./instructor-profile.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public, ResponseMessage, Roles } from "src/core/decorator/customize";

@ApiTags("Instructor Profile")
@Controller("instructor/profile")
export class InstructorProfileController {
  constructor(
    private readonly instructorProfileService: InstructorProfileService
  ) {}

  @Get("@me")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Get current instructor profile" })
  @ResponseMessage("Get instructor profile")
  @ApiBearerAuth()
  getMyProfile(@Req() req) {
    return this.instructorProfileService.getProfile(req.user.id);
  }

  @Patch("@me")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Update current instructor profile" })
  @ResponseMessage("Update instructor profile")
  @ApiBearerAuth()
  updateMyProfile(
    @Req() req,
    @Body() body: { bio?: string; experience?: string }
  ) {
    return this.instructorProfileService.updateProfile(req.user.id, body);
  }

  @Get(":userId")
  @Public()
  @ApiOperation({ summary: "Get instructor profile by User ID" })
  @ResponseMessage("Get instructor profile")
  getProfile(@Param("userId") userId: string) {
    return this.instructorProfileService.getProfile(+userId);
  }
}
