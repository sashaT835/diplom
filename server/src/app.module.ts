import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductsModule } from "./products/products.module";
import { ServicesModule } from "./services/services.module";
import { RequestsModule } from "./requests/requests.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CartModule } from "./cart/cart.module";
import { UploadModule } from "./upload/upload.module";
import { MessagesModule } from "./messages/messages.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ProductsModule,
    ServicesModule,
    RequestsModule,
    AuthModule,
    UsersModule,
    CartModule,
    UploadModule,
    MessagesModule,
  ],
})
export class AppModule {}
