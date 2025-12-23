import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApplyInstructorDto } from "../instructor/dto/apply-instructor.dto";
import { CloudinaryService } from "src/core/cloudinary/cloudinary.service";
import { ResponseMessage, Roles } from "src/core/decorator/customize";

@ApiBearerAuth()
@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post()
  @ResponseMessage("create user")
  @ApiResponse({ status: 201, description: "User created successfully" })
  @Roles("ADMIN")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get("get-all-user")
  @ResponseMessage("get all user")
  @ApiResponse({ status: 200, description: "Users retrieved successfully" })
  @Roles("ADMIN")
  findAll() {
    return this.userService.findAll();
  }

  @Get("@me")
  @ResponseMessage("get user profile")
  @ApiResponse({ status: 200, description: "User retrieved successfully" })
  getProfile(@Req() req) {
    return this.userService.getProfile(req.user.id);
  }

  @Patch("profile")
  @ResponseMessage("update profile")
  @ApiOperation({ summary: "Update user profile" })
  @UseInterceptors(FileInterceptor("avatar"))
  updateProfile(
    @Req() req,
    @Body() updateUserDto,
    @UploadedFile() avatar: Express.Multer.File
  ) {
    return this.userService.updateProfile(req.user.id, updateUserDto, avatar);
  }

  @Patch("change-password")
  @ResponseMessage("update password")
  @ApiOperation({ summary: "Change user password" })
  updatePassword(
    @Req() req,
    @Body()
    body: {
      newPassword1: string;
      newPassword2: string;
      oldPassword: string;
    }
  ) {
    return this.userService.updatePassword(req.user.id, body);
  }

  @Delete("delete-user/:id")
  @ResponseMessage("delete user")
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @Roles("ADMIN")
  deleteUser(@Param("id") userId: number) {
    return this.userService.deleteUser(userId);
  }
}
