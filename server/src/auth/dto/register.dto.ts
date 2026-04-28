import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "user@example.com", description: "Email пользователя" })
  @IsEmail({}, { message: "Введите корректный email" })
  email: string;

  @ApiProperty({ example: "password123", description: "Пароль (минимум 6 символов)", minLength: 6 })
  @IsString()
  @MinLength(6, { message: "Пароль должен содержать минимум 6 символов" })
  password: string;

  @ApiProperty({ example: "Иван", description: "Имя пользователя" })
  @IsString()
  firstName: string;
}
