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
import { CouponModule } from "./modules/coupon/coupon.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { EnrollmentModule } from "./modules/enrollment/enrollment.module";
import { CartModule } from "./modules/cart/cart.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { THROTTLER_CONFIG } from "./core/rate-limit/rate-limit";
import { APP_GUARD } from "@nestjs/core";
import { DiscountCampaignModule } from "./modules/discount-campaign/discount-campaign.module";
import { InstructorAnalyticsModule } from "./modules/instructor-analytics/instructor-analytics.module";
import { CronModule } from "./modules/cron/cron.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot(THROTTLER_CONFIG),
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
    DiscountCampaignModule,
    PaymentModule,
    EnrollmentModule,
    CartModule,
    NotificationModule,
    InstructorAnalyticsModule,
    CronModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
