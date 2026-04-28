import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Регистрация нового пользователя" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Пользователь успешно зарегистрирован",
    schema: {
      example: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: { id: 1, email: "user@example.com", firstName: "Иван", role: "user" },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: "Пользователь с таким email уже существует" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Неверные данные" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Вход в систему" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Успешный вход, возвращает JWT токен",
    schema: {
      example: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: { id: 1, email: "admin@titan.ru", firstName: "Админ", role: "admin" },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Неверный email или пароль" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
