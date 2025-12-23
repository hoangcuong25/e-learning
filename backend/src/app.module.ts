import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { RedisModule, RedisModuleOptions } from "@nestjs-modules/ioredis";
import { InstructorModule } from "./modules/instructor/instructor.module";
import { SpecializationModule } from "./modules/specialization/specialization.module";
import { MailModule } from "./core/mailSender/mail.module";
import { CourseModule } from "./modules/course/course.module";
import { LessonModule } from "./modules/lesson/lesson.module";
import { CloudinaryModule } from "./core/cloudinary/cloudinary.module";
import { PrismaModule } from "./core/prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    PrismaModule,
    MailModule,
    CloudinaryModule,
    // RedisModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => ({
    //     type: 'single',
    //     url: configService.get<string>('UPSTASH_REDIS_URL') || '',
    //   }),
    //   inject: [ConfigService],
    // }),

    UserModule,
    AuthModule,
    InstructorModule,
    SpecializationModule,
    CourseModule,
    LessonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
