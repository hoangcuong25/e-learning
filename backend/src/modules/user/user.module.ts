import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CloudinaryModule } from "src/core/cloudinary/cloudinary.module";
import { PrismaModule } from "src/core/prisma/prisma.module";

@Module({
  imports: [CloudinaryModule, PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
