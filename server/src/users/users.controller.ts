import { Controller, Get, Put, Patch, Param, Body, UseGuards, Request, HttpStatus, ParseIntPipe } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@ApiTags("users")
@ApiBearerAuth("access-token")
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Получить всех пользователей (только для админа)" })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Patch(":id/role")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Изменить роль пользователя (только для админа)" })
  async changeRole(
    @Param("id", ParseIntPipe) id: number,
    @Body("role") role: string,
    @Request() req,
  ) {
    return this.usersService.changeUserRole(id, role, req.user.id);
  }

  @Get(":id/purchases")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Получить заказы пользователя (только для админа)" })
  async getUserPurchases(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.getUserPurchases(id);
  }

  @Get("profile")
  @ApiOperation({ summary: "Получить профиль текущего пользователя" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Профиль пользователя",
    schema: {
      example: {
        id: 1,
        email: "user@example.com",
        firstName: "Иван",
        lastName: "Иванов",
        phone: "+7 (999) 123-45-67",
        role: "user",
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Не авторизован" })
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put("profile")
  @ApiOperation({ summary: "Обновить профиль текущего пользователя" })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: HttpStatus.OK, description: "Профиль обновлён",
    schema: {
      example: {
        id: 1,
        email: "user@example.com",
        firstName: "Иван",
        lastName: "Иванов",
        phone: "+7 (999) 123-45-67",
        role: "user",
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Не авторизован" })
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.id, updateUserDto);
  }
}
