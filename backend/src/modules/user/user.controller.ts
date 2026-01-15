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
import { Public, ResponseMessage, Roles } from "src/decorator/customize";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('user')
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  @Post()
  @ResponseMessage("create user")
  @ApiResponse({ status: 201, description: "User created successfully" })
  @Roles("admin")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get("get-all-user")
  @ResponseMessage("get all user")
  @ApiResponse({ status: 200, description: "Users retrieved successfully" })
  @Roles("admin")
  findAll() {
    return this.userService.findAll();
  }

  @Get("@me")
  @ResponseMessage("get user profile")
  @ApiResponse({ status: 200, description: "User retrieved successfully" })
  getProfile(@Req() req) {
    return this.userService.getProfile(req.user.id);
  }

  // @Patch('update-profile')
  // @ResponseMessage('update profile')
  // @UseInterceptors(FileInterceptor('image'))
  // updateProfile(
  //   @Req() req,
  //   @Body() updateUserDto: UpdateUserDto,
  //   @UploadedFile() image: Express.Multer.File
  // ) {
  //   return this.userService.updateProfile(req.user, updateUserDto, image)
  // }

  // @Patch('update-phone')
  // updatePhone(
  //   @Req() req,
  //   @Body() reqBody: { phone: string }
  // ) {
  //   return this.userService.updatePhone(req.user, reqBody.phone)
  // }

  // @Patch('update-password')
  // updatePassword(
  //   @Req() req,
  //   @Body() reqBody: {
  //     newPassword1: string,
  //     newPassword2: string,
  //     oldPassword: string
  //   }
  // ) {
  //   return this.userService.updatePassword(req.user, reqBody)
  // }

  // @Delete('delete-user/:id')
  // @Roles('admin')
  // deleteUser(@Param('id') userId: string) {
  //   return this.userService.deleteUser(userId)
  // }
}
