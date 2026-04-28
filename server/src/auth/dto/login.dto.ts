import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "admin@titan.ru", description: "Email пользователя" })
  @IsEmail({}, { message: "Введите корректный email" })
  email: string;

  @ApiProperty({ example: "password123", description: "Пароль пользователя" })
  @IsString()
  password: string;
}
