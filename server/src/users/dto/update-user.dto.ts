import { IsString, IsOptional, MinLength, IsEmail } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "Иван", description: "Имя пользователя" })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: "Иванов", description: "Фамилия пользователя" })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: "+7 (999) 123-45-67", description: "Телефон" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: "1990-01-15", description: "Дата рождения (YYYY-MM-DD)" })
  @IsOptional()
  @IsString()
  birthDate?: string;

  @ApiPropertyOptional({ example: "ru", description: "Предпочитаемый язык", enum: ["ru", "en"] })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: "newpassword123", description: "Новый пароль (минимум 6 символов)", minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: "Пароль должен содержать минимум 6 символов" })
  password?: string;
}
