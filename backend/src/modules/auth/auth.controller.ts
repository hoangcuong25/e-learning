import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  BadRequestException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./passport/local-auth.guard";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { Response } from "express";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public, ResponseMessage } from "src/core/decorator/customize";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Public()
  @ApiResponse({ status: 200, description: "Users login successfully" })
  @ResponseMessage("User login")
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Post("register")
  @ResponseMessage("register")
  @ApiResponse({ status: 200, description: "Users register successfully" })
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Get("refresh-token")
  @Public()
  @ApiResponse({ status: 200, description: "Users refresh token successfully" })
  @ResponseMessage("refresh token")
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req);
  }

  @Post("send-email-active")
  @ResponseMessage("send mail active account")
  sendMail(@Req() req) {
    return this.authService.sendEmailActive(req.user.id);
  }

  @Post("active-account")
  @ResponseMessage("comfirm active account")
  comfirmActive(@Req() req, @Body() body) {
    return this.authService.comfirmActive(req.user.id, body.otp);
  }

  @Post("send-reset-otp")
  @Public()
  @ResponseMessage("send reset otp password")
  sendResetOtp(@Body() body) {
    return this.authService.sendResetOtp(body.email);
  }

  @Post("reset-password")
  @Public()
  @ResponseMessage("comfirm active account")
  resetPassword(@Body() body) {
    return this.authService.resetPassword(
      body.email,
      body.otp,
      body.newPassword
    );
  }

  @Post("login-google")
  @Public()
  @ResponseMessage("login with google")
  loginGoogle(
    @Body() body: { googleToken: string },
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.loginGoogle(body.googleToken, response);
  }

  @Post("logout")
  @ResponseMessage("logout")
  logout(@Req() req) {
    return this.authService.logout(req);
  }
}
