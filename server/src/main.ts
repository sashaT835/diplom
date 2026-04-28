import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from uploads directory
  app.useStaticAssets(join(process.cwd(), "uploads"), {
    prefix: "/uploads/",
  });

  // Enable CORS for frontend
  app.enableCors({
    origin: [
      "http://localhost:5173", // Development
      "http://localhost", // Production Docker
      "http://localhost:80", // Explicit port 80
    ],
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle("Titan Products API")
    .setDescription("API для управления каталогом товаров Titan")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        in: "header",
      },
      "access-token",
    )
    .addTag("auth", "Аутентификация и регистрация")
    .addTag("products", "Управление товарами")
    .addTag("services", "Управление услугами")
    .addTag("cart", "Корзина пользователя")
    .addTag("messages", "Сообщения и чаты")
    .addTag("requests", "Заявки на услуги")
    .addTag("users", "Профиль пользователя")
    .addTag("upload", "Загрузка файлов")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation is available at: http://localhost:${port}/api`
  );
}
bootstrap();
