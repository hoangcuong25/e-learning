import { Module, OnModuleInit } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as path from "path";
import * as Handlebars from "handlebars";
import * as dayjs from "dayjs";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>("MAIL_USER"),
            pass: configService.get<string>("MAIL_PASSWORD"),
          },
        },
        defaults: {
          from: `"EduConnect" <no-reply@educonnect.com>`,
        },
        template: {
          dir: path.join(
            process.cwd(),
            "src",
            "core",
            "mailSender",
            "templates"
          ),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
})
export class MailModule implements OnModuleInit {
  onModuleInit() {
    // ✅ Đăng ký helpers ở đây
    Handlebars.registerHelper("formatDate", (date: string | Date) => {
      if (!date) return "";
      return dayjs(date).format("DD/MM/YYYY");
    });

    Handlebars.registerHelper("uppercase", (str: string) =>
      str ? str.toUpperCase() : ""
    );

    Handlebars.registerHelper("capitalize", (str: string) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1) : ""
    );
  }
}
