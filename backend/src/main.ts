import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "./modules/auth/passport/jwt-auth.guard";
import { TransformInterceptor } from "./core/transform.interceptor";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  const port = configService.get<number>("PORT") || 4000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // cho phép tự động ép kiểu string -> number
      transformOptions: { enableImplicitConversion: true },
    })
  );

  app.use(cookieParser());

  //config cors
  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: true,
  });

  // app.setGlobalPrefix('api/v1', { exclude: [''] })

  // Swagger config
  // http://localhost:4000/api-docs
  const config = new DocumentBuilder()
    .setTitle("E-Learning App API")
    .setDescription("API docs for E-Learning App")
    .setVersion("1.0")
    .addBearerAuth() // nếu có JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document, {
    swaggerOptions: { persistAuthorization: true }, // giữ token khi reload
  });

  await app.listen(port, "0.0.0.0");
}
bootstrap();
