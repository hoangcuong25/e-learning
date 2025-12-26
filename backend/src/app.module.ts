import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { InstructorModule } from "./modules/instructor/instructor.module";
import { SpecializationModule } from "./modules/specialization/specialization.module";
import { MailModule } from "./core/mailSender/mail.module";
import { CourseModule } from "./modules/course/course.module";
import { LessonModule } from "./modules/course/lesson/lesson.module";
import { CloudinaryModule } from "./core/cloudinary/cloudinary.module";
import { PrismaModule } from "./core/prisma/prisma.module";
import { QuestionModule } from "./modules/quiz/question/question.module";
import { OptionModule } from "./modules/quiz/option/option.module";
import { QuizModule } from "./modules/quiz/quiz.module";
import { RedisModule } from "./core/redis/redis.module";
import { ChapterModule } from "./modules/course/chapter/chapter.module";
import { CouponModule } from './modules/coupon/coupon.module';
import { DiscountModule } from './modules/discount/discount.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MailModule,
    CloudinaryModule,
    RedisModule,
    UserModule,
    AuthModule,
    InstructorModule,
    SpecializationModule,
    CourseModule,
    LessonModule,
    QuizModule,
    QuestionModule,
    OptionModule,
    ChapterModule,
    CouponModule,
    DiscountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
